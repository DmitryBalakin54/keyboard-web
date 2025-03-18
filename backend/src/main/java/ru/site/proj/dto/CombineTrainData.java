package ru.site.proj.dto;


import ru.site.proj.domain.TrainText;
import ru.site.proj.domain.WordsList;
import ru.site.proj.utils.TrainDataTypes;

import java.util.Date;
import java.util.List;

public class CombineTrainData implements CombinedTrainDataDTO {
    private Long id;
    private String name;
    private List<String> words;
    private String text;
    private Date creationTime;
    private Long userId;
    private String type;

    public CombineTrainData(WordsList wordsList) {
        id = wordsList.getId();
        name = wordsList.getName();
        words = wordsList.getWords();
        creationTime = wordsList.getCreationTime();
        userId = wordsList.getUser().getId();
        type = TrainDataTypes.getWordsListType();
    }

    public CombineTrainData(TrainText trainText) {
        id = trainText.getId();
        name = trainText.getName();
        text = trainText.getText();
        creationTime = trainText.getCreationTime();
        userId = trainText.getUser().getId();
        type = TrainDataTypes.getTrainTextType();
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public List<String> getWords() {
        return words;
    }

    @Override
    public String getText() {
        return text;
    }

    @Override
    public Date getCreationTime() {
        return creationTime;
    }

    @Override
    public Long getUserId() {
        return userId;
    }

    @Override
    public String getType() {
        return type;
    }
}
