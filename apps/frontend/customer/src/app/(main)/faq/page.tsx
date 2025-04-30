import { Faq } from "./faq";

const FaqPage: React.Page = async () => {
  return (
    <div className="flex flex-col">
      <p className="flex h-16 items-center justify-center bg-primary-foreground text-xl font-bold">
        Түгээмэл асуулт хариултууд
      </p>
      <Faq />
    </div>
  );
};

export default FaqPage;
