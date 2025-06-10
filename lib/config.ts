interface Config {
    supabaseUrl : string;
    supabaseKey : string;
}

const config : Config = {
    supabaseUrl : process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '',
    supabaseKey : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
};

export default config;