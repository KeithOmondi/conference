import React, {
  useState,
  useEffect,
  forwardRef,
  type ReactNode,
  type CSSProperties,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPresentations,
  selectPresentationsLoading,
  type IPresentation,
} from "../store/slices/presentationSlice";

// --------------------------------------------------------------
// HTMLFlipBook (simulation)
// --------------------------------------------------------------
interface HTMLFlipBookProps {
  children: ReactNode[];
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
  currentPage: number;
}

const HTMLFlipBook = forwardRef<HTMLDivElement, HTMLFlipBookProps>(
  (
    { children, width, height, className = "", style = {}, currentPage },
    ref
  ) => {
    const pageContent = Array.isArray(children) ? children[currentPage] : null;
    return (
      <div
        ref={ref}
        className={`${className} flex overflow-hidden bg-gray-200 border-4 border-[#005A2B] rounded-lg relative`}
        style={{ width, height, ...style }}
      >
        {pageContent}{" "}
        <div className="absolute bottom-2 right-2 text-xs text-gray-600 bg-gray-100 rounded-tl-lg px-2 py-1 opacity-80">
          (Simulated Flip Book){" "}
        </div>{" "}
      </div>
    );
  }
);

// --------------------------------------------------------------
// Page Component
// --------------------------------------------------------------
interface PageProps {
  children: ReactNode;
  number: number;
  isFlipping: boolean;
  pageType: "cover" | "content";
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, number, isFlipping, pageType }, ref) => (
    <div
      ref={ref}
      className={`         w-full h-full flex flex-col justify-between items-center shadow-inner p-6 relative
        transition-transform duration-700 ease-in-out transform
        ${
          pageType === "cover"
            ? "bg-[#005A2B] text-white"
            : "bg-white border-l border-gray-300"
        }
        ${isFlipping ? "scale-105 opacity-0" : "scale-100 opacity-100"}
      `}
      style={{ minWidth: "360px", minHeight: "520px" }}
    >
      {" "}
      <div className="flex flex-col w-full h-full justify-center items-center">
        {children}
      </div>
      {number > 1 && (
        <div className="absolute bottom-4 right-6 text-sm text-gray-500">
          {number - 1}
        </div>
      )}{" "}
    </div>
  )
);

// --------------------------------------------------------------
// MessagesBook Component
// --------------------------------------------------------------
interface MessagesBookProps {
  image?: string;
}

const MessagesBook: React.FC<MessagesBookProps> = ({ image }) => {
  const dispatch = useDispatch();
  const presentations = useSelector(selectPresentations) as IPresentation[];
  const loading = useSelector(selectPresentationsLoading);

  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // --------------------------------------------------------------
  // Fetch presentations on mount
  // --------------------------------------------------------------
  useEffect(() => {
    dispatch({ type: "presentation/fetchAll" }); // Replace with proper thunk if needed
  }, [dispatch]);

  // --------------------------------------------------------------
  // Loading state
  // --------------------------------------------------------------
  if (loading) {
    return (
      <div className="p-4 text-center text-[#005A2B] font-semibold">
        Loading presentations...{" "}
      </div>
    );
  }

  // --------------------------------------------------------------
  // Build pages
  // --------------------------------------------------------------
  const messagesPages = [
    {
      pageType: "cover" as const,
      type: "cover",
      content: {},
    },
    ...presentations.map((p) => ({
      pageType: "content" as const,
      type: "messages" as const,
      content: [
        {
          sender: `${p.presenter.firstName} ${p.presenter.lastName}`,
          content: p.title,
        },
        {
          sender: "Description",
          content: p.description || "No description provided.",
        },
        { sender: "Download File", content: p.fileUrl || "No file uploaded." },
      ],
    })),
    {
      pageType: "cover" as const,
      type: "cover",
      content: { image },
    },
  ];

  // --------------------------------------------------------------
  // Flip handlers
  // --------------------------------------------------------------
  const flipToPage = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= messagesPages.length) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(newIndex);
      setIsFlipping(false);
    }, 350);
  };

  // --------------------------------------------------------------
  // Render page content
  // --------------------------------------------------------------
  const renderPageContent = (pageData: any, index: number) => {
    if (pageData.type === "cover" && index === 0) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-white text-center">
          {" "}
          <h1 className="text-3xl font-extrabold border-b-2 border-[#C6A64F] pb-4">
            ANNUAL HIGH COURT HUMAN RIGHTS SUMMIT{" "}
          </h1>{" "}
        </div>
      );
    }

    if (pageData.type === "messages") {
      return (
        <>
          <h2 className="text-xl font-bold mb-4 text-[#005A2B] border-b pb-2 w-full">
            Presentation Details
          </h2>
          <ul className="space-y-3 w-full overflow-y-auto">
            {pageData.content.map((msg: any, i: number) => (
              <li
                key={i}
                className="bg-gray-100 p-3 rounded-lg shadow-sm text-sm border"
              >
                <span className="font-semibold text-[#005A2B]">
                  {msg.sender}:
                </span>{" "}
                {msg.content}
              </li>
            ))}
          </ul>
        </>
      );
    }

    if (index === messagesPages.length - 1) {
      return (
        <div className="flex flex-col justify-center items-center text-white p-8 text-center">
          <h2 className="text-3xl font-extrabold mb-4">END OF BRIEFING</h2>
          {pageData.content.image && (
            <img
              src={pageData.content.image}
              className="w-24 h-24 rounded-full border-4 border-white/50 object-cover my-4"
            />
          )}
        </div>
      );
    }

    return null;
  };

  // --------------------------------------------------------------
  // Render Flip Book
  // --------------------------------------------------------------
  return (
    <div className="flex flex-col items-center p-4">
      {" "}
      <HTMLFlipBook
        className="shadow-2xl rounded-xl"
        width={360}
        height={520}
        currentPage={currentPage}
      >
        {messagesPages.map((pageData, index) => (
          <Page
            key={index}
            number={index + 1}
            isFlipping={isFlipping}
            pageType={pageData.pageType}
          >
            {renderPageContent(pageData, index)}{" "}
          </Page>
        ))}{" "}
      </HTMLFlipBook>
      <div className="mt-6 p-3 bg-white rounded-xl shadow-lg flex items-center space-x-4">
        <button
          onClick={() => flipToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          ← Previous
        </button>

        <p className="text-lg font-semibold text-[#005A2B]">
          Page {currentPage + 1} / {messagesPages.length}
        </p>

        <button
          onClick={() => flipToPage(currentPage + 1)}
          disabled={currentPage === messagesPages.length - 1}
          className="px-4 py-2 bg-[#005A2B] text-white rounded-lg disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default MessagesBook;
