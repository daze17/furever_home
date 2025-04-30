import { Cat, Dog, PawPrint, Squirrel } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "ui";
import { cn } from "utils";

export const Faq: React.FC = async () => {
  const data = [
    {
      title: "Амьтан үрчилж авах талаар",
      title_icon: <Cat className="h-8 w-8" />,
      content_img_src: "/faq4.png",
      contents: [
        {
          question: "Хэрхэн амьтан үрчилж авах вэ?",
          content:
            "Explanation of the adoption process, including steps like viewing available pets.",
          value: "question1",
        },
        {
          question: "Хэрвээ үрчилсэн амьтан маань тохирохгүй бол яах вэ?",
          content:
            "Information on return policies, timeframes, and any fees associated with returns.",
          value: "question2",
        },
        {
          question:
            "Амьтад вакцин болон үржил хаалгах мэс засалд орсон уу гэдгийг хэрхэн мэдэх вэ?",
          content:
            "Clarification on the health checks and treatments pets receive prior to adoption.",
          value: "question3",
        },
        {
          question: "Амьтан үрчлэхдээ гэрээ хэрхэн бэлдэх вэ?",
          content:
            "Tips on essential items, creating a safe space, and acclimating a new pet to their new environment.",
          value: "question4",
        },
        {
          question: "Амьтан үрчлэхээсээ өмнө юуг бодолцох хэрэгтэй вэ?",
          content: "Okay. I'll think about it.",
          value: "question5",
        },
        {
          question:
            "Хэрэв би амьтан үрчилж авч чадахгүй бол байгууллагад хэрхэн дэмжлэг үзүүлэх вэ?",
          content:
            "Хандив өргөх, сайн дурын ажил хийх, түр хугацаанд амьтан асрах, эсвэл мэдээллийг хуваалцах гэх мэт.",
          value: "question1",
        },
        {
          question:
            "Шинэ амьтнаа үрчлэхээр ирэхдээ ямар нэгэн зүйл авчрах хэрэгтэй юу?",
          content:
            "Оосор, тээвэрлэгч, тэмдэг, зэрэг зүйлсийг авч ирэх талаар зөвлөмж өгөх.",
          value: "question2",
        },
      ],
    },
    {
      title: "Амьтан үрчлүүлэх талаар",
      title_icon: <Dog className="h-8 w-8" />,
      content_img_src: "/faq5.png",
      contents: [
        {
          question: "Олсон амьтнаа хэрхэн бүртгүүлэх вэ?",
          content: "Сайтаа л ашигла.",
          value: "question1",
        },
        {
          question: "Амьтнаа үрчлүүлэх үед юу бэлдэх хэрэгтэй вэ?",
          content:
            "Оосор, тээвэрлэгч, тэмдэг, зэрэг зүйлсийг авч ирэх талаар зөвлөмж өгөх.",
          value: "question2",
        },
      ],
    },
    {
      title: "Байгууллагын үйл ажиллагааны талаар",
      title_icon: <PawPrint className="h-8 w-8" />,
      content_img_src: "/faq2.png",
      contents: [
        {
          question:
            "Хэрэв би амьтан үрчилж авч чадахгүй бол байгууллагад хэрхэн дэмжлэг үзүүлэх вэ?",
          content:
            "Хандив өргөх, сайн дурын ажил хийх, түр хугацаанд амьтан асрах, эсвэл мэдээллийг хуваалцах гэх мэт.",
          value: "question1",
        },
        {
          question:
            "Хандив өргөсөн тохиолдолд нотлох бичиг баримт олгодог уу？",
          content: "Мхн.",
          value: "question2",
        },
      ],
    },
    {
      title: "Бусад",
      title_icon: <Squirrel className="h-8 w-8" />,
      content_img_src: "/faq3.png",
      contents: [
        {
          question: "Нууц үгээ мартсан бол яах вэ？",
          content: "Санахаас өөр аргагүй л дээ.",
          value: "question1",
        },
        {
          question: "Нэвтрэх нэрээ мартсан бол яах вэ？",
          content: "Санахаас өөр аргагүй л дээ.",
          value: "question2",
        },
      ],
    },
  ];

  return (
    <div className="min-w-3xl mx-auto flex flex-col gap-y-10 py-8">
      {data.map((item, index) => (
        <div key={`faq-${index}`} className="flex flex-col gap-y-2.5 p-2">
          <div className="mb-4 flex items-center gap-4">
            {item.title_icon}
            <h2 className="text-xl font-bold">{item.title}</h2>
          </div>
          {item.contents.map((contentItem, idx) => (
            <Accordion key={idx} type="single" collapsible>
              <AccordionItem
                className="rounded-lg border"
                value={contentItem.value}
              >
                <AccordionTrigger
                  className={cn(
                    "px-4 text-lg md:text-lg lg:text-xl",
                    "hover:rounded-lg hover:bg-primary-foreground hover:no-underline",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.content_img_src}
                      alt="question"
                      height={22}
                      width={22}
                      className="h-8 w-8"
                    />
                    <span className="text-base">{contentItem.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-4 text-sm text-gray-600">
                  {contentItem.content}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      ))}
    </div>
  );
};
