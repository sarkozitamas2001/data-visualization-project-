interface Props {
  tab: string | null;
}

export default function VisualizationInfo({ tab }: Props) {
  switch (tab) {
    case "tree":
      return (
        <>
          <h3>About the Indo-European Language Family</h3>

          <p>
            The Indo-European language family is the world's largest language
            family by number of speakers, encompassing many of the languages
            spoken throughout Europe as well as large parts of South and Western
            Asia. It includes major branches such as Germanic, Romance, Slavic,
            Celtic, Baltic, Hellenic (Greek), Albanian, Armenian, and
            Indo-Iranian. Today, Indo-European languages are spoken by billions
            of people across the globe.
          </p>

          <p>
            Linguists believe that all Indo-European languages descend from a
            common ancestral language known as Proto-Indo-European (PIE).
            Although no written records of this language have survived, scholars
            have reconstructed many of its features through the comparative
            study of related languages. According to the most widely accepted
            theories, Proto-Indo-European was spoken several thousand years ago,
            likely somewhere in the Pontic-Caspian steppe region, before its
            speakers gradually spread across Eurasia.
          </p>

          <p>
            The relationships between these languages provide valuable insights
            into human migration, cultural exchange, and historical development.
            By studying similarities in vocabulary, grammar, and sound changes,
            researchers can trace how modern languages evolved from their common
            ancestor and how different branches of the family became established
            across Europe and Asia.
          </p>

          <p>
            Read more:
            <br />
            <a
              href="https://en.wikipedia.org/wiki/Indo-European_languages"
              target="_blank"
              rel="noopener noreferrer"
            >
              Indo-European languages - Wikipedia
            </a>
          </p>
        </>
      );

    case "flow-map":
      return (
        <>
          <h3>About Hungarian Migration</h3>

          <p>
            The origins of the Hungarian people are commonly associated with the
            Ural region of Eurasia, where the ancestors of modern Hungarians are
            believed to have lived thousands of years ago. Linguistic evidence
            places Hungarian within the Uralic language family, making it
            related to languages such as Finnish and Estonian rather than to its
            Indo-European-speaking neighbors.
          </p>

          <p>
            Between the first millennium BCE and the late ninth century CE,
            various groups associated with the early Hungarians gradually
            migrated westward across the Eurasian steppe. Historical and
            archaeological evidence suggests that they spent time in regions
            east of the Ural Mountains, near the Volga River, and in the Pontic
            steppe before continuing toward Central Europe.
          </p>

          <p>
            The migration culminated in the Hungarian Conquest of the Carpathian
            Basin around 895-896 CE under the leadership of Árpád. The
            Carpathian Basin subsequently became the homeland of the Hungarian
            people and the center of the Kingdom of Hungary.
          </p>

          <p>
            Read more:
            <br />
            <a
              href="https://en.wikipedia.org/wiki/Hungarian_prehistory"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hungarian Prehistory - Wikipedia
            </a>
            <br />
            <a
              href="https://en.wikipedia.org/wiki/Hungarian_conquest_of_the_Carpathian_Basin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hungarian Conquest of the Carpathian Basin - Wikipedia
            </a>
          </p>
        </>
      );

    case "stream-graph":
      return (
        <>
          <h3>Language Speaker Evolution</h3>

          <p>
            Languages constantly evolve and change in their number of speakers
            over time. Factors such as population growth, migration,
            colonization, education, economic influence, and globalization can
            all contribute to the expansion or decline of a language.
          </p>

          <p>
            The dataset used in this visualization presents estimated speaker
            populations for several European languages between 1900 and 2020.
            Throughout this period, languages such as English and Spanish
            experienced significant growth, reflecting their increasing global
            influence and the population growth of countries where they are
            spoken.
          </p>

          <p>
            In contrast, other languages show slower growth or periods of
            stabilization. Comparing these trends helps illustrate how
            historical, cultural, and demographic developments can influence the
            spread and usage of languages across different regions and time
            periods.
          </p>
        </>
      );

    case "gantt-chart":
      return (
        <>
          <h3>Language Evolution Timeline</h3>

          <p>
            Languages continuously evolve over time as pronunciation, grammar,
            vocabulary, and writing systems change. The development of modern
            European languages can often be traced through several historical
            stages spanning many centuries.
          </p>

          <p>
            English originated from the Germanic languages brought to Britain by
            Anglo-Saxon settlers. The language evolved through the Old English,
            Middle English, and Early Modern English periods before developing
            into the form spoken today. Historical events such as the Norman
            Conquest and the influence of Latin and French significantly shaped
            its vocabulary.
          </p>

          <p>
            German developed from the West Germanic branch of the Indo-European
            language family. Its evolution can be followed through Old High
            German, Middle High German, Early New High German, and Modern
            German. Throughout its history, regional dialects and cultural
            developments contributed to the language's diversity and growth.
          </p>

          <p>
            French evolved from the Latin spoken in Roman Gaul. Following the
            fall of the Roman Empire, Vulgar Latin gradually transformed into
            Old French, then Middle French, and finally Modern French. The
            language became one of Europe's most influential languages and
            played an important role in diplomacy, literature, and international
            communication.
          </p>

          <p>
            The timeline visualizes these stages and their durations, making it
            easier to compare how different languages evolved and when major
            linguistic transitions occurred.
          </p>

          <p>
            Further reading:
            <br />
            <a
              href="https://en.wikipedia.org/wiki/History_of_English"
              target="_blank"
              rel="noopener noreferrer"
            >
              History of English - Wikipedia
            </a>
            <br />
            <a
              href="https://en.wikipedia.org/wiki/History_of_German"
              target="_blank"
              rel="noopener noreferrer"
            >
              History of German - Wikipedia
            </a>
            <br />
            <a
              href="https://en.wikipedia.org/wiki/History_of_French"
              target="_blank"
              rel="noopener noreferrer"
            >
              History of French - Wikipedia
            </a>
          </p>
        </>
      );

    default:
      return null;
  }
}
