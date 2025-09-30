'use server';
export async function submitRSVP(formData: FormData) {
  const inviteId = String(formData.get('inviteId') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  /*  const attending = String(formData.get('attending') ?? '') === 'yes';
  const guests = Number(formData.get('guests') ?? 0);
  const note = String(formData.get('note') ?? '').trim();*/

  if (!inviteId || !name) {
    return { ok: false as const, error: 'Missing invite or name' };
  }

  return { ok: true as const };
}
