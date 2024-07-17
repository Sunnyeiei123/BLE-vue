<template>
    <div>
        <!-- <search /> -->
        <BarNav />
        <errLog />
    </div>
</template>

<script>
import BarNav from '../components/bar_nav.vue';
import errLog from '../components/dataAsset.vue';
// import search from '../components/searchButton.vue';

export default {
    components: {
        BarNav,
        // search,
        errLog
    }
}
</script>