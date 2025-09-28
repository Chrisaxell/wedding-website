import WeddingCard from "@/components/WeddingCard.";

export default function WeddingPage() {
    return (
        <main style={{maxWidth: 860, margin: "0 auto", padding: 16}}>
            <WeddingCard
                coupleA="Chris"
                coupleB="Scarlett"
                dateISO="2026-03-29T14:00:00+09:00"
                venueName="Busan Hanok Village"
                venueAddress="37, Example-ro, Busan, South Korea"
                lat={35.1796}
                lng={129.0756}
                kakaoJsKey={process.env.NEXT_PUBLIC_KAKAO_JS_KEY} // or omit if set in env
                rsvpUrl="https://example.com/rsvp"
                musicUrl="/music/our-song.mp3"
                images={[
                    {src: "/photos/1.jpg"},
                    {src: "/photos/2.jpg"},
                    {src: "/photos/3.jpg"},
                ]}
                schedule={[
                    {time: "13:30", title: "Guest Arrival", icon: "🕊️"},
                    {time: "14:00", title: "Ceremony", desc: "Hanok Garden"},
                    {time: "15:00", title: "Photos", desc: "Courtyard"},
                    {time: "16:00", title: "Reception", desc: "Main Hall"},
                ]}
                groomAccount={{bank: "DNB", owner: "Chris", number: "1503.77.12345", note: "Tusen takk ❤️"}}
                brideAccount={{bank: "KB", owner: "Scarlett", number: "123-456-789", note: "감사합니다 💛"}}
                contacts={[
                    {label: "Groom", tel: "tel:+4799999999", sms: "sms:+4799999999?&body=Hi%20Chris"},
                    {label: "Bride", tel: "tel:+821012345678", sms: "sms:+821012345678?&body=Hi%20Scarlett"},
                ]}
                defaultLang="en"
            />
        </main>
    );
}