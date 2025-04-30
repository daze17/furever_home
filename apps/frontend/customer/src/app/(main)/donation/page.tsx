import Donation from "@/components/donation";

const accounts = [
  {
    name: "Хаан банк",
    qr: "/qr.png",
    account: "5003 853 278",
  },
  {
    name: "Хас банк",
    qr: "/qr.png",
    account: "5003 853 278",
  },
  {
    name: "XXБанк",
    qr: "/qr.png",
    account: "5003 853 278",
  },
];

const DonationPage: React.FC = () => {
  return <Donation accounts={accounts} />;
};
export default DonationPage;
