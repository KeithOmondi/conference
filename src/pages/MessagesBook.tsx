// src/components/MessagesBook.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  type ReactNode,
  type CSSProperties,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllPresentations,
  selectPresentations,
  selectPresentationsLoading,
  type IPresentation,
} from "../store/slices/presentationSlice";
import { MdArrowBack, MdArrowForward, MdStar } from "react-icons/md";
import type { AppDispatch } from "../store/store";

/* -------------------- CONFIG -------------------- */
const FLIPBOOK_WIDTH = 380; // px
const FLIPBOOK_HEIGHT = 520; // px
const PAGE_PADDING = 32; // px
const FOOTER_HEIGHT = 48; // px
const PRIMARY_GREEN = "#005A2B";
const ACCENT_GOLD = "#C6A64F";
const LIGHT_PAPER = "#f9f9f0";

/* -------------------- Logo Placeholder -------------------- */
const ThemedLogo = () => (
  <div className="flex items-center justify-end h-10 mb-4">
    <div
      className="text-xs font-bold px-2 py-1 rounded"
      style={{ backgroundColor: ACCENT_GOLD, color: PRIMARY_GREEN }}
    >
      JUDICIARY
    </div>
  </div>
);

/* -------------------- Flipbook / Page -------------------- */
interface HTMLFlipBookProps {
  children: ReactNode[];
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
  currentPage: number;
}
const HTMLFlipBook = forwardRef<HTMLDivElement, HTMLFlipBookProps>(
  ({ children, width, height, className = "", style = {}, currentPage }, ref) => {
    const pageContent = Array.isArray(children) ? children[currentPage] : null;
    return (
      <div
        ref={ref}
        className={`${className} flex overflow-hidden border-4 rounded-xl relative shadow-2xl`}
        style={{
          width,
          height,
          ...style,
          borderColor: PRIMARY_GREEN,
          backgroundColor: LIGHT_PAPER,
        }}
      >
        {pageContent}
      </div>
    );
  }
);

interface PageProps {
  children?: ReactNode;
  number: number;
  isFlipping: boolean;
  pageType: "cover" | "content" | "end";
}
const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, number, isFlipping, pageType }, ref) => (
    <div
      ref={ref}
      className={`w-full h-full relative p-8 transition-transform duration-700 ease-in-out transform ${
        isFlipping ? "scale-105 opacity-0" : "scale-100 opacity-100"
      }`}
      style={{
        minWidth: "360px",
        minHeight: "520px",
        background: pageType === "content" ? LIGHT_PAPER : PRIMARY_GREEN,
        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        className="w-full h-full text-left"
        style={{
          lineHeight: 1.8,
          wordSpacing: "0.1em",
          whiteSpace: "normal",
          wordBreak: "break-word",
          color: pageType === "content" ? "#333" : "white",
          fontSize: 14,
          fontFamily: "inherit",
        }}
      >
        {pageType === "content" && <ThemedLogo />}
        {children}
      </div>

      {pageType === "content" && (
        <div
          className="absolute bottom-4 right-8 text-xs font-bold"
          style={{ color: ACCENT_GOLD }}
        >
          Page {number - 1}
        </div>
      )}
    </div>
  )
);

/* -------------------- Helpers: HTML -> Blocks -------------------- */
const BLOCK_TAGS = new Set([
  "P",
  "DIV",
  "SECTION",
  "ARTICLE",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
  "PRE",
  "TABLE",
]);

const sanitizeWhitespace = (s: string) =>
  s
    .replace(/\r\n/g, "\n")
    .replace(/\n+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const htmlToBlocks = (html: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html || "", "text/html");
  const body = doc.body;
  const blocks: string[] = [];

  body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.has((node as Element).tagName)) {
      blocks.push(sanitizeWhitespace((node as Element).outerHTML));
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = sanitizeWhitespace(node.textContent || "");
      if (text) blocks.push(`<p>${text}</p>`);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      blocks.push(`<p>${(node as Element).innerHTML}</p>`);
    }
  });

  if (blocks.length === 0 && body.innerHTML.trim()) {
    blocks.push(sanitizeWhitespace(body.innerHTML));
  }
  return blocks;
};

/* -------------------- Paginator -------------------- */
const paginateHtmlByHeight = (
  html: string,
  availableHeight: number,
  pageWidth: number,
  topBlockHtml?: string
): string[] => {
  const pages: string[] = [];
  const blocks = htmlToBlocks(html);

  const measure = document.createElement("div");
  measure.style.position = "absolute";
  measure.style.visibility = "hidden";
  measure.style.left = "-9999px";
  measure.style.top = "0";
  measure.style.width = `${pageWidth - PAGE_PADDING * 2}px`;
  measure.style.fontSize = "14px";
  measure.style.lineHeight = "1.8";
  measure.style.wordSpacing = "0.1em";
  measure.style.whiteSpace = "normal";
  measure.style.wordBreak = "break-word";
  measure.style.fontFamily = "inherit";
  measure.style.padding = "0";
  measure.style.margin = "0";
  measure.style.boxSizing = "border-box";
  document.body.appendChild(measure);

  let currentHtmlParts: string[] = [];
  let firstPage = true;

  const commitPage = () => {
    pages.push(currentHtmlParts.join("") || "");
    currentHtmlParts = [];
    firstPage = false;
  };

  const measureWithComposition = (parts: string[]) => {
    const content = parts.join("");
    const composed = firstPage && topBlockHtml ? `${topBlockHtml}${content}` : content;
    measure.innerHTML = composed;
    return measure.scrollHeight;
  };

  const appendBlock = (blockHtml: string) => {
    currentHtmlParts.push(blockHtml);
    if (measureWithComposition(currentHtmlParts) <= availableHeight) return true;

    currentHtmlParts.pop();
    const parser = new DOMParser();
    const doc = parser.parseFromString(blockHtml, "text/html");
    const blockEl = doc.body.firstElementChild;
    if (!blockEl) return;

    const childNodes = Array.from(blockEl.childNodes);
    let pieceParts: string[] = [];
    let started = false;

    for (const child of childNodes) {
      const elHtml = child.nodeType === Node.ELEMENT_NODE ? (child as Element).outerHTML : `<span>${child.textContent}</span>`;
      pieceParts.push(elHtml);

      const wrapperOpen = `<${blockEl.tagName.toLowerCase()}>`;
      const wrapperClose = `</${blockEl.tagName.toLowerCase()}>`;

      const candidate = [...currentHtmlParts, wrapperOpen, ...pieceParts, wrapperClose];
      if (measureWithComposition(candidate) > availableHeight) {
        if (pieceParts.length > 1) {
          pieceParts.pop();
          currentHtmlParts.push(`${wrapperOpen}${pieceParts.join("")}${wrapperClose}`);
        }
        commitPage();
        currentHtmlParts.push(elHtml);
        pieceParts = [];
      }
    }

    if (pieceParts.length) currentHtmlParts.push(`<${blockEl.tagName.toLowerCase()}>${pieceParts.join("")}</${blockEl.tagName.toLowerCase()}>`);
  };

  blocks.forEach((block) => appendBlock(block));
  if (currentHtmlParts.length) commitPage();
  document.body.removeChild(measure);
  return pages;
};

/* -------------------- MessagesBook -------------------- */
interface MessagesBookProps {
  image?: string;
}

const MessagesBook: React.FC<MessagesBookProps> = ({ image }) => {
  const dispatch = useDispatch<AppDispatch>();
  const presentations = useSelector(selectPresentations) as IPresentation[];
  const loading = useSelector(selectPresentationsLoading);

  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const flipbookRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(fetchAllPresentations());
  }, [dispatch]);

  const presentationsByPresenter = useMemo(() => {
    return (presentations || []).reduce<Record<string, IPresentation[]>>((acc, pres) => {
      const presenterId = pres.presenter._id;
      if (!acc[presenterId]) acc[presenterId] = [];
      acc[presenterId].push(pres);
      return acc;
    }, {});
  }, [presentations]);

  const presenterIds = Object.keys(presentationsByPresenter);

  const generatePagesForPresenter = useCallback(
    (presenterPresentations: IPresentation[]) => {
      const pages: ReactNode[] = [];
      if (!presenterPresentations || presenterPresentations.length === 0) return pages;

      const firstPresentation = presenterPresentations[0];
      const presenterName = `${firstPresentation.presenter.firstName} ${firstPresentation.presenter.lastName}`;
      const presenterTitle = firstPresentation.presenter.pj || "Presenter";

      // Cover
      pages.push(
        <div key="cover" className="flex flex-col justify-center items-center h-full text-white text-center p-8">
          <h1 className="text-4xl font-extrabold mb-4 border-b-4 pb-2" style={{ borderColor: ACCENT_GOLD }}>
            {presenterName}
          </h1>
          <p className="text-xl font-light mb-10 italic">{presenterTitle}</p>
          <MdStar size={48} className="my-6" style={{ color: ACCENT_GOLD }} />
          <h2 className="text-2xl font-bold mt-4">Briefing Book</h2>
        </div>
      );

      const contentHeight = FLIPBOOK_HEIGHT - PAGE_PADDING * 2 - FOOTER_HEIGHT - 8;

      presenterPresentations.forEach((p) => {
        const rawHtml = p.description || "<p>No description provided.</p>";
        const titleHtml = `<div style="margin-bottom:8px;"><h3 style="margin:0; color:${PRIMARY_GREEN}; font-weight:800; border-bottom:2px solid ${ACCENT_GOLD}; padding-bottom:6px; font-size:18px;">${p.title}</h3></div>`;
        const cleanedHtml = sanitizeWhitespace(rawHtml);
        const textPages = paginateHtmlByHeight(cleanedHtml, contentHeight, FLIPBOOK_WIDTH, titleHtml);

        textPages.forEach((chunk, idx) => {
          pages.push(
            <div key={`${p._id}-${idx}`} className="flex flex-col h-full" style={{ padding: 0 }}>
              {idx === 0 && <h3 className="text-xl font-extrabold pb-2 mb-2 border-b-2" style={{ color: PRIMARY_GREEN, borderColor: ACCENT_GOLD, margin: "0 0 8px 0", paddingBottom: 6 }}>{p.title}</h3>}
              <div className="flex-grow text-sm" style={{ height: `calc(100% - ${FOOTER_HEIGHT + (idx === 0 ? 56 : 32)}px)`, overflowY: "auto", marginBottom: 8 }}>
                <div style={{ margin: 0, lineHeight: 1.8, wordSpacing: "0.1em" }} dangerouslySetInnerHTML={{ __html: chunk }} />
              </div>
              <div className="mt-4 text-xs font-semibold text-center border-t pt-2" style={{ borderColor: ACCENT_GOLD }}>
                <span style={{ color: PRIMARY_GREEN }}>Presented by:</span>{" "}
                <span style={{ color: ACCENT_GOLD }}>{presenterName}</span>
              </div>
            </div>
          );
        });
      });

      // End page
      pages.push(
        <div key="end" className="flex flex-col justify-center items-center h-full text-white text-center p-8">
          <h2 className="text-3xl font-extrabold mb-4 border-b-2 pb-2" style={{ borderColor: ACCENT_GOLD }}>END OF BRIEFING</h2>
          <p className="text-lg font-light italic mt-4">Thank you for the presentation.</p>
          {image && <img src={image} alt="Event Logo" className="w-24 h-24 rounded-full border-4 my-4 object-cover" style={{ borderColor: ACCENT_GOLD }} />}
        </div>
      );

      return pages;
    },
    [image]
  );

  const presenterBooks = useMemo(() => presenterIds.map((id) => generatePagesForPresenter(presentationsByPresenter[id])), [presentationsByPresenter, presenterIds, generatePagesForPresenter]);

  const currentBook = presenterBooks[currentBookIndex] || [];
  const currentPresenterId = presenterIds[currentBookIndex];
  const currentPresenterName = currentPresenterId && presentationsByPresenter[currentPresenterId]?.[0]
    ? `${presentationsByPresenter[currentPresenterId][0].presenter.firstName} ${presentationsByPresenter[currentPresenterId][0].presenter.lastName}`
    : "Book";

  const flipToPage = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= currentBook.length) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(newIndex);
      setIsFlipping(false);
    }, 250);
  };

  const nextBook = () => {
    if (currentBookIndex < presenterBooks.length - 1) {
      setCurrentBookIndex((i) => i + 1);
      setCurrentPage(0);
    }
  };

  const prevBook = () => {
    if (currentBookIndex > 0) {
      setCurrentBookIndex((i) => i - 1);
      setCurrentPage(0);
    }
  };

  if (loading) return <div className="p-8 text-center text-xl font-semibold" style={{ color: PRIMARY_GREEN }}>Loading presentations...</div>;
  if (!presentations.length) return <div className="p-8 text-center text-xl font-semibold" style={{ color: PRIMARY_GREEN }}>No presentations available.</div>;

  return (
    <div className="flex flex-col items-center p-4 space-y-6">
      <h1 className="text-2xl font-black mb-2 tracking-tight" style={{ color: PRIMARY_GREEN }}>Briefing Book: {currentPresenterName}</h1>

      <HTMLFlipBook ref={flipbookRef} className="shadow-2xl rounded-xl" width={FLIPBOOK_WIDTH} height={FLIPBOOK_HEIGHT} currentPage={currentPage}>
        {currentBook.map((page, index) => {
          let pageType: "cover" | "content" | "end" = "content";
          if (index === 0) pageType = "cover";
          if (index === currentBook.length - 1) pageType = "end";
          return <Page key={index} number={index + 1} isFlipping={isFlipping} pageType={pageType}>{page}</Page>;
        })}
      </HTMLFlipBook>

      <div className="flex space-x-6">
        <button onClick={prevBook} disabled={currentBookIndex === 0} className="px-4 py-2 text-sm font-semibold rounded disabled:opacity-50 transition-colors shadow-md" style={{ backgroundColor: ACCENT_GOLD, color: PRIMARY_GREEN }}><MdArrowBack className="inline mr-1" /> Previous Presenter</button>
        <button onClick={nextBook} disabled={currentBookIndex === presenterBooks.length - 1} className="px-4 py-2 text-sm font-semibold rounded disabled:opacity-50 transition-colors shadow-md" style={{ backgroundColor: ACCENT_GOLD, color: PRIMARY_GREEN }}>Next Presenter <MdArrowForward className="inline ml-1" /></button>
      </div>

      <div className="p-3 bg-white rounded-xl shadow-lg flex items-center justify-between w-full max-w-md border-t-4" style={{ borderColor: PRIMARY_GREEN }}>
        <button onClick={() => flipToPage(currentPage - 1)} disabled={currentPage === 0} className="px-4 py-2 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors flex items-center" style={{ backgroundColor: ACCENT_GOLD, color: PRIMARY_GREEN }}><MdArrowBack className="mr-1" /> Prev Page</button>
        <span className="font-bold text-sm" style={{ color: PRIMARY_GREEN }}>Page {currentPage + 1} / {currentBook.length}</span>
        <button onClick={() => flipToPage(currentPage + 1)} disabled={currentPage === currentBook.length - 1} className="px-4 py-2 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors flex items-center" style={{ backgroundColor: PRIMARY_GREEN }}>Next Page <MdArrowForward className="ml-1" /></button>
      </div>
    </div>
  );
};

export default MessagesBook;
