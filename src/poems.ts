type Poem = {
    title: string
    author: string
    poem: string
}

const presetPoems: Array<Poem> = [
    {
        title: "The Lake Isle of Innisfree",
        author: "William Butler Yeats",
        poem:
            `I will arise and go now, and go to Innisfree,
And a small cabin build there, of clay and wattles made;
Nine bean-rows will I have there, a hive for the honey-bee,
And live alone in the bee-loud glade.

And I shall have some peace there, for peace comes dropping slow,
Dropping from the veils of the morning to where the cricket sings;
There midnight's all a glimmer, and noon a purple glow,
And evening full of the linnet's wings.

I will arise and go now, for always night and day
I hear lake water lapping with low sounds by the shore;
While I stand on the roadway, or on the pavements grey,
I hear it in the deep heart's core.`
    },
    {
        title: "Song: to Celia [“Drink to me only with thine eyes”]",
        author: "Ben Jonson",
        poem:
            `Drink to me only with thine eyes,
        And I will pledge with mine;
Or leave a kiss but in the cup,
        And I'll not look for wine.
The thirst that from the soul doth rise
        Doth ask a drink divine;
But might I of Jove's nectar sup,
        I would not change for thine.

I sent thee late a rosy wreath,
        Not so much honouring thee
As giving it a hope, that there
        It could not withered be.
But thou thereon didst only breathe,
        And sent'st it back to me;
Since when it grows, and smells, I swear,
        Not of itself, but thee.`
    },
    {
        title: "She sweeps with many-colored brooms",
        author: "Emily Dickinson",
        poem:
            `She sweeps with many-colored brooms,
And leaves the shreds behind;
Oh, housewife in the evening west,
Come back, and dust the pond!

You dropped a purple ravelling in,
You dropped an amber thread;
And now you've littered all the East
With duds of emerald!

And still she plies her spotted brooms,
And still the aprons fly,
Till brooms fade softly into stars —
And then I come away.`
    },
    {
        title: "For One Who Is Exhausted",
        author: "John O'Donohue",
        poem:
            `When the rhythm of the heart becomes hectic,
Time takes on the strain until it breaks;
Then all the unattended stress falls in
On the mind like an endless, increasing weight.

The light in the mind becomes dim.
Things you could take in your stride before
Now become laborsome events of will.

Weariness invades your spirit.
Gravity begins falling inside you,
Dragging down every bone.

The tide you never valued has gone out.
And you are marooned on unsure ground.
Something within you has closed down;
And you cannot push yourself back to life.

You have been forced to enter empty time.
The desire that drove you has relinquished.
There is nothing else to do now but rest
And patiently learn to receive the self
You have forsaken in the race of days.

At first your thinking will darken
And sadness take over like listless weather.
The flow of unwept tears will frighten you.

You have traveled too fast over false ground;
Now your soul has come to take you back.

Take refuge in your senses, open up
To all the small miracles you rushed through.

Become inclined to watch the way of rain
When it falls slow and free.

Imitate the habit of twilight,
Taking time to open the well of color
That fostered the brightness of day.

Draw alongside the silence of stone
Until its calmness can claim you.
Be excessively gentle with yourself.

Stay clear of those vexed in spirit.
Learn to linger around someone of ease
Who feels they have all the time in the world.

Gradually, you will return to yourself,
Having learned a new respect for your heart
And the joy that dwells far within slow time.`
    },
    {
        title: "Beannacht",
        author: "John O'Donohue",
        poem:
            `On the day when
the weight deadens
on your shoulders
and you stumble,
may the clay dance
to balance you.

And when your eyes
freeze behind
the grey window
and the ghost of loss
gets into you,
may a flock of colours,
indigo, red, green
and azure blue,
come to awaken in you
a meadow of delight.

When the canvas frays
in the currach of thought
and a stain of ocean
blackens beneath you,
may there come across the waters
a path of yellow moonlight
to bring you safely home.

May the nourishment of the earth be yours,
may the clarity of light be yours,
may the fluency of the ocean be yours,
may the protection of the ancestors be yours.

And so may a slow
wind work these words
of love around you,
an invisible cloak
to mind your life.`
    },
    {
        title: "Sonnet 54",
        author: "William Shakespeare",
        poem:
            `O, how much more doth beauty beauteous seem
By that sweet ornament which truth doth give!
The rose looks fair, but fairer we it deem
For that sweet odour which doth in it live.
The canker-blooms have full as deep a dye
As the perfumèd tincture of the roses,
Hand on such thorns, and play as wantonly
When summer's breath their maskèd buds discloses;
But, for their virtue only is their show,
They live unwoo'd and unrespected fade,
Die to themselves. Sweet roses do not so;
Of their sweet deaths are sweetest odours made.
 And so of you, beauteous and lovely youth,
 When that shall fade, my verse distils your truth.`
    }
]
const presetPoemsMap = presetPoems.reduce((acc, poem) => {
    acc[poem.title] = poem.poem
    return acc
}, {} as { [key: string]: string })

export { presetPoems, presetPoemsMap }