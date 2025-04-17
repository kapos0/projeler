import ToTheMySite from "@/components/ToTheMySite";

export default function Projects() {
    return (
        <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
            <h1 className="text-3xl font-semibold">Look for my portfolio</h1>
            <p className="text-md text-muted-foreground">
                I am working hard to become a Full-Stack developer. I find
                myself successful in teamwork and I value the synergy that comes
                from working together. I also have experience as a computer
                technician; I am proficient in computer hardware.
            </p>
            <ToTheMySite />
        </div>
    );
}
