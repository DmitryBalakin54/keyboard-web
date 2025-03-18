package ru.site.proj.Utils;

import java.util.Collections;
import java.util.List;
import java.util.Random;

public final class WordsRandomSorting {
    public static final int MAXIMUM_WORDS = 1000;

    private static List<String> wordsRandomSort(List<String> words) {
        Random rand = new Random();

        for (int i = 0; i < words.size() - 1; i++) {
            Collections.swap(words, i, rand.nextInt(words.size()));
        }

        return words;
    }

    public static List<String> getWordsMaximumLenRandomisedList(List<String> words) {
        List<String> wordsRandomized = wordsRandomSort(words);
        if (wordsRandomized.size() >= MAXIMUM_WORDS) {
            return wordsRandomized.subList(0, MAXIMUM_WORDS + 1);
        }

        Random rand = new Random();

        for (int i = 0; i < 1000 - wordsRandomized.size(); i++) {
            wordsRandomized.add(wordsRandomized.get(rand.nextInt(wordsRandomized.size())));
        }

        return wordsRandomized;
    }
}
