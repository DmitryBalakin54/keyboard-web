package ru.site.proj.dto;

import java.util.Date;
import java.util.List;

public interface CombinedTrainDataDTO {
    Long getId();
    List<String> getWords();
    String getText();
    Date getCreationTime();
    Long getUserId();
    String getType();
}
