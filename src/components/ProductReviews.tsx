"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, MessageSquare, Pencil, Star, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Review } from "@/types";
import ConfirmDialog from "@/components/ConfirmDialog";

function Stars({ value }: { value: number }) {
  return (
    <span className="flex shrink-0" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${
            n <= value ? "fill-amber-400 text-amber-400" : "text-stone-300"
          }`}
        />
      ))}
    </span>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { token, userId } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api<{ data: Review[] }>(
        `/products/${productId}/reviews`
      );
      setReviews(res.data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(r: Review) {
    setEditingId(r._id);
    setText(r.review);
    setRating(r.rating);
  }

  function cancelEdit() {
    setEditingId(null);
    setText("");
    setRating(5);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please write your review first");
      return;
    }
    setSubmitting(true);
    try {
      const body = JSON.stringify({ review: text.trim(), rating });
      const headers = { token: token ?? "" };

      if (editingId) {
        await api(`/reviews/${editingId}`, { method: "PUT", headers, body });
        toast.success("Your review was updated");
      } else {
        await api(`/products/${productId}/reviews`, {
          method: "POST",
          headers,
          body,
        });
        toast.success("Thanks for your review");
      }
      cancelEdit();
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    const id = deletingId;
    setDeletingId(null);
    if (!id) return;
    try {
      await api(`/reviews/${id}`, {
        method: "DELETE",
        headers: { token: token ?? "" },
      });
      toast.success("Review deleted");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const shown = hover || rating;

  return (
    <section className="mt-16 border-t border-stone-200 pt-10">
      <h2 className="mb-6 text-2xl font-bold text-stone-900">
        Customer reviews{" "}
        <span className="text-lg font-medium text-stone-400">
          ({reviews.length})
        </span>
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* الفورم */}
        <div className="min-w-0 lg:col-span-1">
          {token ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 lg:sticky lg:top-24"
            >
              <h3 className="font-semibold text-stone-900">
                {editingId ? "Edit your review" : "Write a review"}
              </h3>

              <div
                className="flex gap-1"
                onMouseLeave={() => setHover(0)}
                role="radiogroup"
                aria-label="Rating"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} stars`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-7 w-7 transition ${
                        n <= shown
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder="Share your thoughts about this product..."
                className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting
                    ? "Saving..."
                    : editingId
                    ? "Update review"
                    : "Submit review"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 hover:border-stone-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-5 text-sm text-stone-600">
              Login to write a review.
            </p>
          )}
        </div>

        {/* القايمة */}
        <div className="min-w-0 lg:col-span-2">
          {loading ? (
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl bg-stone-100"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 py-14 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-stone-300" />
              <p className="mt-3 font-medium text-stone-700">No reviews yet</p>
              <p className="text-sm text-stone-500">Be the first to review.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => {
                const mine = userId !== null && r.user?._id === userId;
                const name = r.user?.name ?? "User";
                return (
                  <li
                    key={r._id}
                    className="min-w-0 rounded-2xl border border-stone-200 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold uppercase text-green-800">
                          {name.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-stone-900">
                            {name}
                          </p>
                          <p className="text-xs text-stone-400">
                            {new Date(r.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Stars value={r.rating} />
                    </div>

                    <p className="mt-3 leading-relaxed text-stone-700 [overflow-wrap:anywhere]">
                      {r.review}
                    </p>

                    {mine && (
                      <div className="mt-4 flex gap-4 border-t border-stone-100 pt-3 text-sm">
                        <button
                          onClick={() => startEdit(r)}
                          className="flex items-center gap-1.5 font-medium text-green-700 hover:underline"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setDeletingId(r._id)}
                          className="flex items-center gap-1.5 font-medium text-red-600 hover:underline"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deletingId !== null}
        title="Delete review?"
        message="Your review will be permanently deleted."
        confirmText="Yes, delete"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </section>
  );
}