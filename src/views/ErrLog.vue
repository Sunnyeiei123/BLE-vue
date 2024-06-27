<template>
    <div>
        <div>
            <div>
                <!-- <search /> -->
                <Location />
                <BarNav />
            </div>
        </div>
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