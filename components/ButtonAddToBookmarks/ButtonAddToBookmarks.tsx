// "use client";

// import { useState } from "react";
// import toast from "react-hot-toast";
// import css from "./ButtonAddToBookmarks.module.css";
// import ErrorSaveModal from "../ErrorSaveModal/ErrorSaveModal";

// interface ButtonAddToBookmarksProps {
//   articleId: string;
//   initialIsSaved?: boolean;
//   isLoggedIn: boolean;
// }

// export default function ButtonAddToBookmarks({
//   articleId,
//   initialIsSaved = false,
//   isLoggedIn,
// }: ButtonAddToBookmarksProps) {
//   const [isSaved, setIsSaved] = useState<boolean>(initialIsSaved);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//   const handleClick = async () => {
//     if (!isLoggedIn) {
//       setIsModalOpen(true);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       if (isSaved) {
//         toast.success("Видалено зі збережених");
//       } else {
//         toast.success("Додано в збережені");
//       }

//       setIsSaved((prev) => !prev);
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Щось пішло не так. Спробуйте пізніше.";
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <button
//         type="button"
//         onClick={handleClick}
//         disabled={isLoading}
//         aria-label={isSaved ? "Remove from bookmarks" : "Add to bookmarks"}
//         className={`${css.saveButton} ${isSaved ? css.active : ""} ${
//           isLoading ? css.loading : ""
//         }`}
//       >
//         {isLoading ? (
//           <span className={css.spinner} />
//         ) : (
//           <svg className={css.icon} width="24" height="24" viewBox="0 0 24 24">
//             <use xlinkHref="/icons.svg#icon-bookmark" />
//           </svg>
//         )}
//       </button>

//       {isModalOpen && <ErrorSaveModal onClose={() => setIsModalOpen(false)} />}
//     </>
//   );
// }
