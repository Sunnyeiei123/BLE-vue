<template>
    <div>
        <div>
            <div>
                <search />
                <errLog />
                <BarNav />
            </div>
        </div>
    </div>



</template>

<script>
import BarNav from '../components/bar_nav.vue';
import errLog from '../components/dataTable.vue';
import search from '../components/searchBox.vue';

export default {
    components: {
        BarNav,
        errLog,
        search
    }
}
</script>