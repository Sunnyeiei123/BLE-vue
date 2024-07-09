// mapsData.js
export default [
    {
        imageUrl: require('@/assets/อาคาร Wellnese 9 ชั้น-1.png'),
        imageBounds: [
            [0, 0],
            [1700, 2800]
        ],
        markers: [
            {
                position: [817, 1766],
                popupText: 'สถานที่ 1'
            },
            {
                position: [1300, 850],
                popupText: 'สถานที่ 2'
            }
        ]
    },
    {
        imageUrl: require('@/assets/อาคาร Wellnese 9 ชั้น-2.png'),
        imageBounds: [
            [0, 0],
            [1700, 2800]
        ],
        markers: [
            {
                position: [600, 800],
                popupText: 'สถานที่ A'
            },
            {
                position: [1100, 1600],
                popupText: 'สถานที่ B'
            }
        ]
    },
    // เพิ่มข้อมูลแผนที่ 3 และ 4
];

// exports.modules = {}