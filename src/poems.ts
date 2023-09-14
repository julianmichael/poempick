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
    }
]
const presetPoemsMap = presetPoems.reduce((acc, poem) => {
    acc[poem.title] = poem.poem
    return acc
}, {} as { [key: string]: string })

export { presetPoems, presetPoemsMap }