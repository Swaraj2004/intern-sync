export async function getRoles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/roles`, {
    next: { revalidate: 7 * 60 * 60 * 1000 },
  });

  return res.json();
}
