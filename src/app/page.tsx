import { getTalks } from "@/lib/talks";
import { getSpeaker } from "@/lib/speaker";
import { TalkCard } from "@/components/TalkCard";
import { SpeakerHeader } from "@/components/SpeakerHeader";

export default async function Home() {
  const talks = await getTalks();
  const speaker = getSpeaker();

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center pb-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Accidental Thought Leadership
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A chronological collection of Julia Kordick's public conference talks, workshops, and speaking events.
          </p>
        </header>

        {speaker && (
          <SpeakerHeader speaker={speaker} />
        )}

        <div className="space-y-6 w-full">
          {talks.map((talk) => (
            <TalkCard key={`${talk.date}-${talk.title}`} talk={talk} />
          ))}
          
          {talks.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-900 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700">
              <p>No talks found.</p>
              <p className="text-sm mt-2">Check back later for updates!</p>
            </div>
          )}
        </div>
        
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8">
          <p>© {new Date().getFullYear()} Accidental Thought Leadership</p>
        </footer>
      </div>
    </main>
  );
}
