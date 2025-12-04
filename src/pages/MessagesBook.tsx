import React from "react";
import HTMLFlipBook from "react-pageflip";

interface MessagesBookProps {
  user: {
    name: string;
    title: string;
    image: string;
  };
}

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="bg-white w-full h-full">{children}</div>;
};

const MessagesBook: React.FC<MessagesBookProps> = ({ user }) => {
  return (
    <div className="w-full flex justify-center mt-6">
      <HTMLFlipBook
        width={350}
        height={500}
        size="stretch"
        minWidth={300}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1536}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        usePortrait={true}
        drawShadow={true}
        autoSize={true}
        flippingTime={700}
        startPage={0}
        clickEventForward={true}
        swipeDistance={30}
        className="shadow-2xl rounded-lg"
        style={{}}
        startZIndex={1}
        useMouseEvents={true}
        showPageCorners={true}
        disableFlipByClick={false}
      >
        {/* ---------- PAGE 1 ---------- */}
        <Page>
          <div className="relative flex flex-col items-center justify-center p-6 h-full">
            <div
              className="absolute inset-0 opacity-10 bg-center bg-contain bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://res.cloudinary.com/drls2cpnu/image/upload/v1764746866/Justice_e548ka.jpg')",
              }}
            />

            <div className="relative z-10 text-center">
              <img
                src={user.image}
                alt="User"
                className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg mx-auto mb-4 object-cover"
              />

              <h1 className="text-2xl font-bold text-gray-900">
                {user.name}
              </h1>

              <p className="text-lg text-gray-700 mt-1">
                {user.title}
              </p>
            </div>
          </div>
        </Page>

        {/* ---------- PAGE 2 ---------- */}
        <Page>
          <div className="p-6 h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Messages
            </h2>

            <ul className="space-y-3">
              <li className="bg-gray-100 p-3 rounded-lg shadow-sm">
                John: Meeting at 10 AM
              </li>

              <li className="bg-gray-100 p-3 rounded-lg shadow-sm">
                Mary: Presentation slides ready
              </li>
            </ul>
          </div>
        </Page>
      </HTMLFlipBook>
    </div>
  );
};

export default MessagesBook;
