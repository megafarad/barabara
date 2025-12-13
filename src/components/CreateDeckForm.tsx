import { type CreateDeckInput, CreateDeckInputSchema } from "../schemas/createDeckInput.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export interface CreateDeckFormProps {
  onSubmit: (input: CreateDeckInput) => Promise<void>;
  submitLabel?: string;
}

export default function CreateDeckForm({
  onSubmit,
  submitLabel = "Create Collection",
}: CreateDeckFormProps) {
  const [theme] = useState("light");
  const isDark = theme === "dark";
  
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<CreateDeckInput>({
    resolver: zodResolver(CreateDeckInputSchema),
  });

  const formSubmit = handleSubmit(onSubmit);

  return (
    <form onSubmit={formSubmit} className="max-w-2xl">
      <div className={`rounded-2xl border backdrop-blur-xl p-10 transition-all duration-700 ${
        isDark 
          ? "bg-white/5 border-white/10" 
          : "bg-zinc-50 border-zinc-900/5"
      }`}>
        <div className="space-y-8">
          <div>
            <label
              htmlFor="name"
              className={`block text-sm tracking-wide mb-4 font-medium ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Collection Name
            </label>
            <input
              type="text"
              {...register("name")}
              className={`
                w-full px-6 py-4 rounded-xl border text-base tracking-wide
                focus:outline-none focus:ring-2 transition-all
                ${isDark
                  ? "bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:ring-white/20 focus:border-white/20"
                  : "bg-white border-zinc-900/10 text-zinc-900 placeholder:text-zinc-400 focus:ring-zinc-900/10 focus:border-zinc-900/20"
                }
              `}
              placeholder="e.g., Spanish Vocabulary, Computer Science, Medical Terms"
            />
            <p className={`mt-3 text-sm ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}>
              Choose a descriptive name for your flashcard collection
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full px-8 py-4 rounded-xl text-sm tracking-wide font-medium
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isDark
                  ? "bg-white text-zinc-900 hover:bg-zinc-100"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
                }
                ${!isSubmitting && "hover:scale-[1.02]"}
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className={`mt-8 p-6 rounded-2xl border backdrop-blur-xl ${
        isDark 
          ? "bg-blue-500/5 border-blue-500/10" 
          : "bg-blue-50 border-blue-100"
      }`}>
        <div className="flex gap-4">
          <svg className={`w-5 h-5 shrink-0 mt-0.5 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className={`text-sm font-medium mb-2 ${
              isDark ? "text-blue-300" : "text-blue-900"
            }`}>
              Tips for better learning
            </h4>
            <ul className={`text-sm space-y-1 ${
              isDark ? "text-blue-400/80" : "text-blue-700"
            }`}>
              <li>• Keep collection names specific and organized</li>
              <li>• Break large topics into smaller collections</li>
              <li>• Add cards regularly for consistent progress</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}