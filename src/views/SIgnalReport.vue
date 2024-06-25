<template>
    <div>
        <!-- <search /> -->
        <errLog />
        <BarNav />
    </div>
</template>

<script>
import BarNav from '../components/bar_nav.vue';
import errLog from '../components/signalReport.vue';
// import search from '../components/searchButton.vue';

export default {
    components: {
        BarNav,
        // search,
        errLog
    }
}
</script>