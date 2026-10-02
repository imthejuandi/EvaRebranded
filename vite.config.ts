import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import {defineConfig} from 'vite';
// Static study: no Worker runtime, database, or patient-data connection.
export default defineConfig({
 cacheDir:'.vinext/vite-cache',
 css:{postcss:{plugins:[tailwindcss()]}},
 server:{watch:{useFsEvents:false,usePolling:true}},
 plugins:[vinext()],
});
