const features = [
  {
    icon: "🚚",
    title: "Fast delivery",
    text: "Your order reaches your door quickly and safely.",
  },
  {
    icon: "💳",
    title: "Flexible payment",
    text: "Pay with cash on delivery or securely online.",
  },
  {
    icon: "🔄",
    title: "Easy returns",
    text: "Not happy with an item? We make returns simple.",
  },
  {
    icon: "🎧",
    title: "Friendly support",
    text: "We are here to help whenever you need us.",
  },
];

export default function Features() {
  return (
    <section className="bg-green-50 py-12">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-lg bg-white p-6 text-center shadow-sm"
          >
            <div className="text-4xl">{f.icon}</div>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}