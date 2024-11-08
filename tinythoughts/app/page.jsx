import Feed from "@/components/Feed";

export default function Home() {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover & Share
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> Little Things</span>
      </h1>
      <p className="desc text-center">
      A place where you can freely share the crazy things you think in bed, in the shower or on the toilet, who knows, maybe you will find some crazy people like you.
      </p>
      <Feed />
    </section>
  );
}
