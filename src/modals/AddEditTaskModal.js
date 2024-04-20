import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import crossIcon from "../assets/icon-cross.svg";
import boardsSlice from "../redux/boardsSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"; // Add this line
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required("Task Name is required"),
  subtasks: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Subtask Name is required"),
    })
  ),
});

function AddEditTaskModal({
  type,
  device,
  setIsTaskModalOpen,
  setIsAddTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
}) {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );
  const columns = board.columns;
  const defaultStatus = columns[prevColIndex].name;

  const { handleSubmit, control, formState: { errors }, register, remove, append } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (type === "add") {
      dispatch(
        boardsSlice.actions.addTask({
          ...data,
          newColIndex: data.statusIndex,
        })
      );
    } else {
      dispatch(
        boardsSlice.actions.editTask({
          ...data,
          taskIndex,
          prevColIndex,
          newColIndex: data.statusIndex,
        })
      );
    }
    setIsAddTaskModalOpen(false);
    if (type === "edit") {
      setIsTaskModalOpen(false);
    }
  };

  return (
    <div
      className={`${
        device === "mobile"
          ? "py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-[-100vh] top-0 dropdown"
          : "py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-0 top-0 dropdown"
      }`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsAddTaskModalOpen(false);
      }}
    >
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
        <h3 className="text-lg">{type === "edit" ? "Edit" : "Add New"} Task</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-8 flex flex-col space-y-1">
            <label className="text-sm dark:text-white text-gray-500" htmlFor="task-name-input">Task Name</label>
            <input
              id="task-name-input"
              type="text"
              className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
              placeholder="e.g Take coffee break"
              {...register("title")}
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>

          <div className="mt-8 flex flex-col space-y-1">
            <label className="text-sm dark:text-white text-gray-500" htmlFor="task-description-input">Description</label>
            <textarea
              id="task-description-input"
              className="bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"
              placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
              {...register("description")}
            />
          </div>

          <div className="mt-8 flex flex-col space-y-3">
            <label className="text-sm dark:text-white text-gray-500">Subtasks</label>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center w-full">
                <input
                  type="text"
                  className="bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"
                  placeholder="e.g Take coffee break"
                  {...register(`subtasks.${index}.title`)}
                />
                <img
                  src={crossIcon}
                  onClick={() => remove(index)}
                  className="m-4 cursor-pointer"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ title: "" })}
              className="w-full items-center hover:opacity-70 dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7] py-2 rounded-full"
            >
              + Add New Subtask
            </button>
          </div>

          <div className="mt-8 flex flex-col space-y-3">
            <label className="text-sm dark:text-white text-gray-500">Current Status</label>
            <select
              className="select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0 border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none"
              {...register("statusIndex")}
              defaultValue={defaultStatus}
            >
              {columns.map((column, index) => (
                <option key={index} value={index}>{column.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative text-white bg-[#635fc7] py-2 rounded-full"
            >
              {type === "edit" ? "Save Edit" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditTaskModal;
