type Props = {
  middle?: string;
};

export default function Divider({ middle }: Props) {
  if (middle)
    return (
      <div className="relative flex items-center w-full gap-2 my-10 font-semibold text-black uppercase opacity-10">
        <hr className="w-1/2 border-black" />
        <p>{middle}</p>
        <hr className="w-1/2 border-black" />
      </div>
    );
  return <hr />;
}
