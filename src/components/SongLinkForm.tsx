import { useEffect, useState, useMemo } from "react";
import parseTimeToSeconds from "../utils/parse-time-to-seconds";
import formatSecondsToTimestamp from "../utils/format-seconds-to-timestamp";

/* ---------- Types ---------- */

export interface SongYouTubeLinkFormType {
  id: number;
  url: string;
  start_seconds: number | null;
  end_seconds: number | null;
  is_featured: boolean;
  title: string;
  description: string | null;
  thumbnail_key: string | null;
}

interface SongLinkFormState {
  start_time: string;
  end_time: string;
  is_featured: boolean;
  description: string;
}

interface SongLinkFormProps {
  title: string;
  link: SongYouTubeLinkFormType;
  onSubmit: (data: {
    start_seconds: number | null;
    end_seconds: number | null;
    is_featured: boolean;
    description: string | null;
  }) => void;
  onCancel?: () => void;
  submitting: boolean;
  error: string | null;
}

/* ---------- Component ---------- */

export default function SongLinkForm({
  title,
  link,
  onSubmit,
  onCancel,
  submitting,
  error,
}: SongLinkFormProps) {
  const initialFormState = useMemo<SongLinkFormState>(
    () => ({
      start_time: formatSecondsToTimestamp(link.start_seconds),
      end_time: formatSecondsToTimestamp(link.end_seconds),
      is_featured: link.is_featured,
      description: link.description ?? "",
    }),
    [link],
  );

  const [form, setForm] = useState<SongLinkFormState>(initialFormState);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof SongLinkFormState, string>>
  >({});

  /* Reset if link changes */
  useEffect(() => {
    setForm(initialFormState);
  }, [initialFormState]);

  function update<K extends keyof SongLinkFormState>(
    key: K,
    value: SongLinkFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(
    start: number | null,
    end: number | null,
    description: string,
  ) {
    const errors: Partial<Record<keyof SongLinkFormState, string>> = {};

    if (start !== null && start < 0) {
      errors.start_time = "Start time cannot be negative.";
    }

    if (end !== null && end < 0) {
      errors.end_time = "End time cannot be negative.";
    }

    if (start !== null && end !== null && end <= start) {
      errors.end_time = "End time must be greater than start time.";
    }

    if (description.length > 255) {
      errors.description = "Description cannot exceed 255 characters.";
    }

    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errors: Partial<Record<keyof SongLinkFormState, string>> = {};

    let start: number | null = null;
    let end: number | null = null;

    // Parse start
    try {
      start = parseTimeToSeconds(form.start_time);
    } catch {
      errors.start_time = "Invalid start time format";
    }

    // Parse end
    try {
      end = parseTimeToSeconds(form.end_time);
    } catch {
      errors.end_time = "Invalid end time format";
    }

    // Stop early if parsing failed
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Logical validation
    const logicalErrors = validate(start, end, form.description);

    if (Object.keys(logicalErrors).length > 0 || !isDirty) {
      setValidationErrors(logicalErrors);
      return;
    }

    setValidationErrors({});

    onSubmit({
      start_seconds: start,
      end_seconds: end,
      is_featured: form.is_featured,
      description:
        form.description.trim() === "" ? null : form.description.trim(),
    });
  }

  function handleReset() {
    setForm(initialFormState);
    setValidationErrors({});
  }

  const isDirty = (Object.keys(form) as (keyof SongLinkFormState)[]).some(
    (key) => form[key] !== initialFormState[key],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
      {/* Header */}
      <h2 className="whitespace-nowrap flex-1 text-xl font-bold text-purple-900 h-8">
        {title}
      </h2>

      {/* Server Error */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
          <ul className="list-disc list-inside">
            {Object.values(validationErrors).map((message, idx) => (
              <li key={idx}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Read-only Fields */}
      <div className="flex flex-wrap gap-5">
        {/* Title */}
        <div className="flex flex-col flex-1 basis-96">
          <label
            htmlFor="song-link-title"
            className="text-gray-500 text-sm mb-1"
          >
            Title
          </label>
          <input
            id="song-link-title"
            type="text"
            value={link.title}
            disabled
            className="border border-gray-300 bg-gray-200 rounded px-2 py-1"
          />
        </div>

        {/* YouTube URL */}
        <div className="flex flex-col flex-1 basis-96">
          <label htmlFor="song-link-url" className="text-gray-500 text-sm mb-1">
            YouTube URL
          </label>
          <input
            id="song-link-url"
            type="text"
            value={link.url}
            disabled
            className="border border-gray-300 bg-gray-200 rounded px-2 py-1"
          />
        </div>

        {/* Thumbnail URL */}
        <div className="flex flex-col flex-1 basis-96">
          <label
            htmlFor="song-thumbnail-url"
            className="text-gray-500 text-sm mb-1"
          >
            Thumbnail URL
          </label>
          <input
            id="song-thumbnail-url"
            type="text"
            value={link.thumbnail_key ?? ""}
            placeholder="None"
            disabled
            className="border border-gray-300 bg-gray-200 rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Times and Description */}
      <div className="flex flex-wrap gap-5">
        <div className="flex flex-col flex-1 flex-wrap basis-32 gap-3">
          {/* Start seconds */}
          <div className="flex flex-1 flex-col">
            <label
              htmlFor="start-time"
              className="text-gray-500 text-sm mb-1"
            >
              Start Time
            </label>
            <input
              id="start-time"
              type="text"
              inputMode="tel"
              value={form.start_time}
              placeholder="90, 01:30, 1:02:03"
              title="Allowed formats - 90, 01:30, 1:02:03, 90s, 1m30s, 1h2m3s"
              disabled={submitting}
              onChange={(e) => update("start_time", e.target.value)}
              className="border border-gray-300 bg-white rounded px-2 py-1 w-full"
            />
          </div>

          {/* End seconds */}
          <div className="flex flex-1 flex-col">
            <label htmlFor="end-time" className="text-gray-500 text-sm mb-1">
              End Time
            </label>
            <input
              id="end-time"
              type="text"
              inputMode="tel"
              value={form.end_time}
              placeholder="90, 01:30, 1:02:03"
              title="Allowed formats - 90, 01:30, 1:02:03, 90s, 1m30s, 1h2m3s"
              disabled={submitting}
              onChange={(e) => update("end_time", e.target.value)}
              className="border border-gray-300 bg-white rounded px-2 py-1 w-full"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col flex-3  basis-64">
          <label
            htmlFor="description"
            className="text-gray-500 text-sm mb-1 block"
          >
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            disabled={submitting}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="border border-gray-300 bg-white rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      {/* Checkbox and buttons */}
      <div className="flex w-full flex-wrap justify-between">
        {/* Featured */}
        <div className="flex items-center gap-2">
          <input
            id="is-featured"
            type="checkbox"
            checked={form.is_featured}
            disabled={submitting}
            onChange={(e) => update("is_featured", e.target.checked)}
            className="w-4 h-4 accent-purple-700 border border-purple-950 hover:cursor-pointer"
          />
          <label
            htmlFor="is-featured"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Featured
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Update */}
          <button
            type="submit"
            disabled={!isDirty || submitting}
            className={`px-3 py-1 rounded-md text-gray-50 transition
              ${
                isDirty
                  ? "bg-purple-900 hover:bg-purple-700 hover:cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            Update
          </button>

          {/* Reset */}
          <button
            type="button"
            disabled={!isDirty || submitting}
            className={`px-3 py-1 rounded-md transition
              ${
                isDirty
                  ? "bg-gray-700 text-white hover:bg-gray-600 hover:cursor-pointer"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }
            `}
            onClick={handleReset}
          >
            Reset
          </button>

          {/* Cancel */}
          <button
            type="button"
            className="px-3 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 hover:cursor-pointer"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
