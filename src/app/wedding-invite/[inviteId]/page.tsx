type Props = { params: { inviteId: string } };

export default async function InvitePage({ params }: Props) {
  // TODO: fetch invite by params.inviteId
  return (
      <main style={{ padding: 24 }}>
        <h1>Invite</h1>
        <p>Invite ID: {params.inviteId}</p>
        <p>RSVP widget coming here.</p>
      </main>
  );
}
