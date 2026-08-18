export interface SampleChatPreset {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  participantsCount: number;
  messageCount: number;
  rawText: string;
}

export const SAMPLE_CHATS: SampleChatPreset[] = [
  {
    id: 'dating-duo',
    name: 'Elena & Liam',
    category: '1-on-1 Dating / Relationship',
    badge: 'Couple Dynamics',
    description: 'A 6-month romantic conversation with banter, late-night talks, date planning, and emoji storms.',
    participantsCount: 2,
    messageCount: 140,
    rawText: `[12/02/2024, 08:30:15] Liam: Good morning! ☀️ Did you end up finishing that book last night?
[12/02/2024, 08:32:40] Elena: Morning!! Yes omg, the plot twist at 2am destroyed me 😭☕
[12/02/2024, 08:33:10] Elena: Now I'm surviving entirely on cold brew. How was your run?
[12/02/2024, 08:34:00] Liam: Freezing but good! 🏃‍♂️ Knocked out 7k.
[12/02/2024, 08:34:45] Liam: Are we still on for sushi tonight at 7:30?
[12/02/2024, 08:35:10] Elena: Absolutely! That place in Soho right?
[12/02/2024, 08:35:25] Liam: ‎<attached: 00000001-PHOTO.jpg>
[12/02/2024, 08:35:30] Liam: Yep! Booked the counter seats.
[12/02/2024, 08:36:00] Elena: Perfection ❤️ See you tonight!

[12/02/2024, 23:15:20] Elena: That spicy tuna roll was insane haha. Thanks for dinner 🥰
[12/02/2024, 23:16:05] Liam: Best sushi in town hands down! Let's do that matcha dessert place next time.
[12/02/2024, 23:17:12] Elena: Deal! Sleep well Liam 🌙
[12/02/2024, 23:17:40] Liam: Goodnight Elena ✨

[14/02/2024, 09:12:00] Elena: Happy Valentine's Day! 🌹 Look what arrived at my desk!
[14/02/2024, 09:12:15] Elena: ‎image omitted
[14/02/2024, 09:14:02] Liam: Haha you like them? 😊 The florist swore those peonies were fresh today.
[14/02/2024, 09:15:20] Elena: I love them so much!! You are the sweetest ❤️❤️❤️
[14/02/2024, 09:16:00] Elena: Can't wait for our trip to the coast this weekend.
[14/02/2024, 09:20:10] Liam: Packed my camera already 📸 It's going to be gorgeous.
[14/02/2024, 18:45:00] Liam: Heading to your place now, grabbing Thai takeout on the way 🍜
[14/02/2024, 18:46:12] Elena: Woohoo! Extra peanut sauce please! 🙏

[18/02/2024, 11:20:00] Liam: ‎<attached: 00000002-PHOTO.jpg>
[18/02/2024, 11:20:10] Liam: Sunset yesterday was breathtaking.
[18/02/2024, 11:22:45] Elena: Wow that frame of the lighthouse is stunning! Send me the full res version!
[18/02/2024, 11:23:15] Liam: Uploading to Google Drive: https://photos.google.com/share/sunset-coastal
[18/02/2024, 11:25:30] Elena: Got it! Making it my phone wallpaper right now haha.
[18/02/2024, 22:40:00] Elena: Are you watching the new true crime documentary on Netflix?
[18/02/2024, 22:41:10] Liam: Not yet! Is it scary?
[18/02/2024, 22:42:00] Elena: Super creepy but so addictive 😱
[18/02/2024, 22:43:15] Liam: Let's binge it together tomorrow!

[25/02/2024, 14:00:10] Liam: Hey! Quick question - what was the name of that pasta recipe we cooked?
[25/02/2024, 14:02:30] Elena: Cacio e Pepe with roasted garlic! Here is the link: https://cooking.nytimes.com/recipes/cacio-e-pepe
[25/02/2024, 14:03:00] Liam: Legend! Making it for my brother visiting today.
[25/02/2024, 14:03:40] Elena: Don't forget to save the pasta water!! That's the secret 🧀
[25/02/2024, 14:04:10] Liam: Understood chef 🫡

[03/03/2024, 10:15:00] Elena: Good morning! ☕ Any plans for Sunday brunch?
[03/03/2024, 10:18:22] Liam: Hey! Was thinking we could try that new bakery in Brooklyn? 🥐
[03/03/2024, 10:19:00] Elena: The one with the pistachio croissants?! YES PLEASE.
[03/03/2024, 10:20:15] Liam: Pick you up at 10:30?
[03/03/2024, 10:20:45] Elena: Sounds like a date 😉
[03/03/2024, 23:50:12] Liam: That was the best croissant I've ever had in my life.
[03/03/2024, 23:51:00] Elena: Right?! Still thinking about the cream filling haha 😂
[03/03/2024, 23:52:10] Liam: We are definitely going back next weekend.
[03/03/2024, 23:53:00] Elena: 100% haha. Goodnight! ✨
[03/03/2024, 23:53:30] Liam: Sweet dreams Elena ❤️

[15/03/2024, 08:45:00] Elena: Morning! Hope your big presentation goes well today! You're going to crush it 🚀💪
[15/03/2024, 08:47:15] Liam: Thank you so much Elena!! Feeling ready, but a little nervous 😅
[15/03/2024, 08:48:00] Elena: You prepared for weeks! Deep breaths, you got this!!
[15/03/2024, 13:30:00] Liam: WE WON THE CONTRACT!! 🎉🎉🎉
[15/03/2024, 13:30:45] Elena: OMG CONGRATULATIONS!!!! 🥳🥂🍾
[15/03/2024, 13:31:20] Elena: I KNEW IT!! Drinks on you tonight haha
[15/03/2024, 13:32:00] Liam: Absolutely! Rooftop bar at 8?
[15/03/2024, 13:32:30] Elena: You bet! Can't wait to celebrate ❤️`
  },
  {
    id: 'startup-founders',
    name: 'Alex & Sarah (Tech Startup)',
    category: '1-on-1 Co-founders',
    badge: 'Fast Pace & High Volume',
    description: 'Intense product launch discussions, deployment alerts, user feedback, and metric milestones.',
    participantsCount: 2,
    messageCount: 95,
    rawText: `01/04/2024, 07:15 - Alex: Morning Sarah. Just checked the Stripe dashboard - we passed $10k MRR overnight! 🚀
01/04/2024, 07:16 - Sarah: Holy crap!! That's huge! Was it the Product Hunt traffic?
01/04/2024, 07:18 - Alex: Yep, we ranked #2 of the Day! 3,400 signups in 24 hours.
01/04/2024, 07:19 - Sarah: <Media omitted>
01/04/2024, 07:20 - Sarah: The server latency is holding up well, 42ms p95 on Deno Deploy.
01/04/2024, 07:22 - Alex: That edge routing is doing wonders. Let's make sure our database connection pool doesn't choke when US East wakes up.
01/04/2024, 07:23 - Sarah: Already increased max connections to 50 on Supabase.
01/04/2024, 07:25 - Alex: Top tier execution as always.

01/04/2024, 11:30 - Alex: Investor from Sequoia just reached out on LinkedIn.
01/04/2024, 11:31 - Sarah: Which partner?
01/04/2024, 11:32 - Alex: Roelof's team. Wants a 20min intro call tomorrow at 3pm PST.
01/04/2024, 11:33 - Sarah: Wow. Let's update the deck with today's retention curves.
01/04/2024, 11:35 - Sarah: https://pitch.com/p/launch-deck-2024
01/04/2024, 11:40 - Alex: Slide 4 needs the updated CAC:LTV ratio. It's now 1:4.8 thanks to organic referral loop.
01/04/2024, 11:42 - Sarah: Done! Check slide 7 for the roadmap milestones.

01/04/2024, 17:00 - Alex: Quick bug report: Safari users reporting dark mode toggle glitch.
01/04/2024, 17:05 - Sarah: Investigating now. Ah, CSS backdrop-filter prefix issue.
01/04/2024, 17:15 - Sarah: Fixed in PR #142 and deployed to production.
01/04/2024, 17:16 - Alex: Verified! You're a machine haha ⚡

02/04/2024, 08:00 - Sarah: Good morning! Prepared talking points for the Sequoia call.
02/04/2024, 08:05 - Alex: Looking over them now. Focus on the organic developer adoption and API retention.
02/04/2024, 15:45 - Alex: Call went incredible. They asked for a follow-up term sheet discussion next Tuesday!
02/04/2024, 15:46 - Sarah: YESSS! 🍾 Massive milestone Alex! Let's build the future.`
  },
  {
    id: 'weekend-squad',
    name: 'The Weekend Squad (Group)',
    category: 'Group Chat (4 People)',
    badge: 'High Energy & Banter',
    description: 'A 4-person friend group planning trips, sharing memes, roasting each other, and organizing dinners.',
    participantsCount: 4,
    messageCount: 160,
    rawText: `[10/05/2024, 14:20:00] Maya: OK team, cabin trip in Lake Tahoe next month. Who is in?! 🌲🏕️
[10/05/2024, 14:21:15] Sam: 1000% in. I dibs the master bedroom with the hot tub view.
[10/05/2024, 14:21:40] Leo: In your dreams Sam 😂 You slept on the couch last year because you lost Mario Kart.
[10/05/2024, 14:22:10] Chloe: I am so in!! Let me send the Airbnb link I bookmarked: https://airbnb.com/rooms/tahoe-luxury-chalet
[10/05/2024, 14:23:00] Maya: ‎<attached: chalet.jpg>
[10/05/2024, 14:23:05] Maya: Look at this patio!!
[10/05/2024, 14:24:20] Sam: That firepit is calling my name. Who is driving?
[10/05/2024, 14:25:00] Leo: I can drive my SUV, fits all 4 of us plus snowboards/luggage easily.
[10/05/2024, 14:25:30] Chloe: Perfect! I will make the legendary road trip playlist 🎵

[10/05/2024, 19:40:00] Sam: Guys, dinner tonight? Tacos at El Pastor? 🌮
[10/05/2024, 19:41:10] Maya: OMG YES I was literally craving carnitas!
[10/05/2024, 19:42:00] Leo: On my way! Table for 4?
[10/05/2024, 19:43:15] Chloe: Be there in 15 mins! Save me guacamole! 🥑

[11/05/2024, 01:30:20] Sam: ‎sticker omitted
[11/05/2024, 01:31:00] Leo: Sam why are you sending stickers at 1:30am go to sleep 😂
[11/05/2024, 01:31:45] Sam: Inspiration never sleeps Leo.
[11/05/2024, 09:00:00] Maya: Morning everyone! Airbnb is officially BOOKED for June 14-17!! 🎉
[11/05/2024, 09:02:10] Chloe: WOOHOO!! Tahoe here we come!
[11/05/2024, 09:03:00] Leo: Let's goooo! 🏂`
  }
];
