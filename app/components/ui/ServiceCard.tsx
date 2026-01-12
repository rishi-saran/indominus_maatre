type ServiceCardProps = {
  title: string;
  image: string;
};

export default function ServiceCard({
  title,
  image,
}: ServiceCardProps) {
  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
        <h3 className="text-white text-xl font-semibold">
          {title}
        </h3>
        <span className="text-white text-sm">
          Book Now →
        </span>
      </div>
    </div>
  );
}
