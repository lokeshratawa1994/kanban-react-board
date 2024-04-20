import React from "react";
import crossIcon from "../assets/icon-cross.svg";
import boardsSlice from "../redux/boardsSlice";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Board Name is required"),
  columns: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Column Name is required"),
    })
  ),
});

function AddEditBoardModal({ setIsBoardModalOpen, type }) {
  const dispatch = useDispatch();
  const { handleSubmit, control, formState: { errors }, getValues, setColumns, fields, append } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      columns: [
        { name: "Todo" },
        { name: "Doing" },
      ],
    },
  });

  const onSubmit = (data) => {
    setIsBoardModalOpen(false);
    if (type === "add") {
      dispatch(boardsSlice.actions.addBoard(data));
    } else {
      dispatch(boardsSlice.actions.editBoard(data));
    }
  };

  const onDelete = (index) => {
    const columns = [...getValues("columns")];
    columns.splice(index, 1);
    setColumns(columns);
  };

  return (
    <div
      className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 left-0 bottom-0 justify-center items-center flex dropdown"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsBoardModalOpen(false);
      }}
    >
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8 py-8 rounded-xl">
        <h3 className="text-lg ">{type === "edit" ? "Edit" : "Add New"} Board</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-8 flex flex-col space-y-1">
            <label className="text-sm dark:text-white text-gray-500" htmlFor="board-name-input">Board Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="bg-transparent px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
                  placeholder="e.g Web Design"
                />
              )}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div className="mt-8 flex flex-col space-y-3">
            <label className="text-sm dark:text-white text-gray-500">Board Columns</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center w-full">
                <Controller
                  name={`columns[${index}].name`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      className="bg-transparent flex-grow px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"
                      placeholder="Column Name"
                    />
                  )}
                />
                {errors.columns && errors.columns[index] && (
                  <p className="text-red-500">{errors.columns[index].name.message}</p>
                )}
                <img
                  src={crossIcon}
                  onClick={() => onDelete(index)}
                  className="m-4 cursor-pointer"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ name: "" })}
              className="w-full items-center hover:opacity-70 dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7] py-2 rounded-full"
            >
              + Add New Column
            </button>
            <button
              type="submit"
              className="w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative text-white bg-[#635fc7] py-2 rounded-full"
            >
              {type === "add" ? "Create New Board" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditBoardModal;
