import Image from "next/image";

interface Props {
  height: number;
  width: number;
}

export const Logo = ({ height, width }: Props) => {
  return (
    <div>
      <Image src={`/logo.png`} alt="logo" width={width} height={height} />
    </div>
  );
};
