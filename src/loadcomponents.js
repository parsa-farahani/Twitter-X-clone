const loadComponents = async () => {
   const componentsSrcs = [
      './components/user-tweet/user-tweet.js'
   ];

   componentsSrcs.map(src => {
      const script = document.createElement('script');
      script.src = src;
      script.type = "module";

      document.head.append(script);
   })
}

export default loadComponents;