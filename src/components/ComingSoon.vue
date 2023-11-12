<template>
    <div class="flex flex-col items-center justify-center w-100">
        <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist, will be there Soon.">
        </a-result>
        <a-button type="primary">
            <router-link to="/">Back Home</router-link></a-button>
    </div>
</template>
<script>


export default {
    name: 'ComingSoon',
}
</script>
  
  