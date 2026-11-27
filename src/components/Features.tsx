import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast delivery",
    text: "Your order reaches your door quickly and safely.",
  },
  {
    icon: ShieldCheck,
    title: "Flexible payment",
    text: "Pay with cash on delivery or securely online.",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    text: "Not happy with an item? We make returns simple.",
  },
  {
    icon: Headphones,
    title: "Friendly support",
    text: "We are here to help whenever you need us.",
  },
];

export default function Features() {
  return (
    <section className="border-y border-stone-200 bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-semibold text-stone-900">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}