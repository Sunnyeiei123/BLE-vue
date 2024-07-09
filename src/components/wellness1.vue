<template>
    <div>
        <img :src="floor1" alt="Floor 1 Map" />
    </div>
</template>

<script>
import img from '@/assets/อาคาร Wellnese 9 ชั้น-1.png';

export default {
    data() {
        return {
            floor1: img  // Ensure data is returned as an object
        };
    }
};
</script>

<style scoped>
/* Add scoped styles if necessary */
</style>
