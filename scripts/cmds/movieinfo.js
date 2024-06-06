const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "movieinfo",
    aliases: ["mi"],
    author: "ArYAN",
    version: "1.2",
    cooldowns: 5,
    role: 0,
    shortDescription: "Get movie information",
    longDescription: "Retrieve detailed information about a movie, including title, year, genre, plot, poster, vote average, vote count, popularity, original language, adult rating, backdrop image, runtime, director, cast, production companies, budget, revenue, tagline, homepage, production countries, and spoken languages.",
    category: "media",
    guide: "{p}movieinfo [movie name] - Fetches and displays information about the specified movie.",
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      if (args.length === 0) {
        return message.reply("❌ Please provide a movie name.");
      }

      const movieTitle = args.join(" ");
      const response = await axios.get(`https://itsaryan.onrender.com/api/movieinfo?title=${encodeURIComponent(movieTitle)}`);

      if (!response.data || response.data.error) {
        return message.reply("❌ Sorry, no information found for that movie.");
      }

      const movieData = response.data;

      // Fetch additional details like runtime, director, cast, production companies, budget, revenue, tagline, homepage, production countries, and spoken languages
      const additionalResponse = await axios.get(`https://itsaryan.onrender.com/api/movieinfo/v2?id=${movieData.id}`);
      const additionalData = additionalResponse.data;

      const genres = additionalData.genre;
      const productionCountries = additionalData.production_countries;
      const spokenLanguages = additionalData.spoken_languages;
      const director = additionalData.director;
      const cast = additionalData.cast;
      const productionCompanies = additionalData.production_companies;

      const movieInfoText = `
        Title: ${movieData.title || "N/A"}
        Original Title: ${movieData.original_title || "N/A"}
        Year: ${new Date(movieData.release_date).getFullYear() || "N/A"}
        Tagline: ${additionalData.tagline || "N/A"}
        Genre: ${genres || "N/A"}
        Plot: ${movieData.plot || "N/A"}
        Vote Average: ${movieData.vote_average || "N/A"}
        Vote Count: ${movieData.vote_count || "N/A"}
        Popularity: ${movieData.popularity || "N/A"}
        Original Language: ${movieData.original_language || "N/A"}
        Adult: ${movieData.adult ? "Yes" : "No"}
        Runtime: ${additionalData.runtime || "N/A"} minutes
        Director: ${director}
        Cast: ${cast}
        Production Companies: ${productionCompanies}
        Budget: ${additionalData.budget || "N/A"}
        Revenue: ${additionalData.revenue || "N/A"}
        Production Countries: ${productionCountries || "N/A"}
        Spoken Languages: ${spokenLanguages || "N/A"}
        Homepage: ${additionalData.homepage || "N/A"}
        Movie ID: ${movieData.id || "N/A"})
      `;

      const sendImage = async (url, path, callback) => {
        const writer = fs.createWriteStream(path);
        const imageResponse = await axios({
          url: url,
          method: 'GET',
          responseType: 'stream'
        });
        imageResponse.data.pipe(writer);
        writer.on('finish', callback);
        writer.on('error', (error) => {
          console.error(error);
          message.reply("❌ Sorry, an error occurred while processing an image.");
        });
      };

      const posterUrl = `${movieData.imageBase}${movieData.poster_path}`;
      const backdropUrl = `${movieData.imageBase}${movieData.backdrop_path}`;
      const posterPath = `/tmp/${movieData.title.replace(/ /g, "_")}_poster.jpg`;
      const backdropPath = `/tmp/${movieData.title.replace(/ /g, "_")}_backdrop.jpg`;

      const sendMessageWithAttachments = () => {
        const attachments = [];
        if (fs.existsSync(posterPath)) attachments.push(fs.createReadStream(posterPath));
        if (fs.existsSync(backdropPath)) attachments.push(fs.createReadStream(backdropPath));

        message.reply({
          body: movieInfoText.trim(),
          attachment: attachments
        });
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      };

      if (movieData.poster_path && movieData.backdrop_path) {
        await sendImage(posterUrl, posterPath, async () => {
          await sendImage(backdropUrl, backdropPath, sendMessageWithAttachments);
        });
      } else if (movieData.poster_path) {
        await sendImage(posterUrl, posterPath, sendMessageWithAttachments);
      } else if (movieData.backdrop_path) {
        await sendImage(backdropUrl, backdropPath, sendMessageWithAttachments);
      } else {
        await message.reply({ body: movieInfoText.trim() });
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      }

    } catch (error) {
      console.error(error);
      message.reply("❌ Sorry, an error occurred while processing your request.");
    }
  }
};
