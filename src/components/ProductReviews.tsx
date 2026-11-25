"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lip/api";
import { useAuth } from "@/context/AuthContext";
import { Review } from "@/types";
import ConfirmDialog from "@/components/ConfirmDialog";

function Stars({ value }: { value: number }) {
  return (
    <span className="text-yellow-500" aria-label={`${value} out of 5`}>
      {"★".repeat(value)}
      <span className="text-gray-300">{"★".repeat(5 - value)}</span>
    </span>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { token, userId } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setText("");
    setRating(5);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please write your review");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const body = JSON.stringify({ review: text.trim(), rating });
      const headers = { token: token ?? "" };

      if (editingId) {
        await api(`/reviews/${editingId}`, { method: "PUT", headers, body });
      } else {
        await api(`/products/${productId}/reviews`, {
          method: "POST",
          headers,
          body,
        });
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section className="mt-10 border-t pt-8">
      <h2 className="mb-4 text-xl font-bold">Reviews ({reviews.length})</h2>

      {token ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <label htmlFor="rating" className="text-sm font-medium">
              Rating
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded border p-2"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Share your thoughts about this product..."
            className="w-full rounded border p-2 focus:border-green-600 focus:outline-none"
          />

          {error && (
            <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
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
                className="rounded border px-5 py-2 hover:border-green-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="mb-8 rounded bg-gray-50 p-3 text-sm text-gray-600">
          Login to write a review.
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first!</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => {
            const mine = userId !== null && r.user?._id === userId;
            return (
              <li key={r._id} className="rounded-lg border bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.user?.name ?? "User"}</span>
                  <Stars value={r.rating} />
                </div>
                <p className="mt-2 text-gray-700">{r.review}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {new Date(r.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {mine && (
                    <span className="flex gap-3 text-sm">
                      <button
                        onClick={() => startEdit(r)}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(r._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

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