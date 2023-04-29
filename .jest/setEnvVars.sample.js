process.env.PORT='0';
process.env.MONGO_ATLAS_ADDRESS='';
process.env.MONO_ATLAS_DATABASE='';
process.env.MONGO_ATLAS_USERNAME='';
process.env.MONGO_ATLAS_PASSWORD='';
process.env.MONGO_URI=`mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_ADDRESS}/${process.env.MONGO_ATLAS_DATABASE}?retryWrites=true&w=majority`;