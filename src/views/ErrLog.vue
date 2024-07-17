<template>
    <div>
        <!-- <search /> -->
        <BarNav />
        <Location />
    </div>
</template>

<script>
import BarNav from '../components/bar_nav.vue';
import Location from '../components/dataTable.vue';
// import search from '../components/searchBox.vue';

export default {
    components: {
        BarNav,
        Location,
        // search
    }
}
</script>