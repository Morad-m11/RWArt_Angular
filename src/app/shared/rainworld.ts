import { TagCategory } from 'src/app/features/posts/shared/post.interface';

interface Filter {
    category: TagCategory;
    name: string;
    icon: string;
    items: { name: string; icon: string }[];
}

export const RAIN_WORLD = {
    Slugcats: [
        { name: 'Survivor', icon: 'survivor' },
        { name: 'Monk', icon: 'monk' },
        { name: 'Hunter', icon: 'hunter' },
        { name: 'Gourmand', icon: 'gourmand' },
        { name: 'Spearmaster', icon: 'spearmaster' },
        { name: 'Artificer', icon: 'artificer' },
        { name: 'Rivulet', icon: 'rivulet' },
        { name: 'Saint', icon: 'saint' },
        { name: 'Watcher', icon: 'watcher' }
    ],
    Iterators: [
        { name: 'Looks to the moon', icon: 'moon' },
        { name: 'Five Pebbles', icon: 'pebbles' }
    ],
    Creatures: [{ name: 'Pink Lizard', icon: 'pink-lizard' }]
};

export const FILTERS: Filter[] = [
    {
        category: 'type',
        name: 'Type',
        icon: 'type_specimen',
        items: [
            { name: 'Artwork', icon: 'brush' },
            { name: 'Meme', icon: 'celebration' },
            { name: 'Animation', icon: 'animation' }
        ]
    },
    {
        category: 'character',
        name: 'Character',
        icon: 'pest_control_rodent',
        items: [
            { name: 'Slugcat', icon: 'survivor' },
            { name: 'Creature', icon: 'pink-lizard' },
            { name: 'Iterator', icon: 'moon' }
        ]
    },
    {
        category: 'style',
        name: 'Style',
        icon: 'palette',
        items: [
            { name: 'Digital', icon: 'tablet' },
            { name: 'Sketch', icon: 'draw' },
            { name: '3D', icon: 'view_in_ar' }
        ]
    }
];
