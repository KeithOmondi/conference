interface PresenterCardProps {
  name: string;
  title?: string;
  description: string;
  image?: string;
}

const PresenterCard = ({ name, title, description, image }: PresenterCardProps) => {
  return (
    <div className="bg-[#0F3B35] text-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row">
      {/* LEFT TEXT SECTION */}
      <div className="p-6 flex-1">
        <h3 className="text-2xl font-semibold mb-2">{name}</h3>

        {title && (
          <p className="text-lg font-medium text-yellow-400 mb-3">
            {title}
          </p>
        )}

        <p className="text-sm leading-relaxed opacity-90 whitespace-pre-line">
          {description}
        </p>
      </div>

      {/* RIGHT PHOTO SECTION */}
      <div className="relative bg-white flex items-center justify-center p-6 md:w-1/3">
        {/* Yellow Crescent Arc */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-yellow-500 rounded-r-full"></div>

        <img
          src={image || "/placeholder-avatar.png"}
          alt={name}
          className="relative z-10 w-36 h-36 rounded-full object-cover border-4 border-white shadow"
        />
      </div>
    </div>
  );
};

export default PresenterCard;
