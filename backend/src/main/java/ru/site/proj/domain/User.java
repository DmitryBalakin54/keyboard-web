package ru.site.proj.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.List;


@Table(
        name = "users",
        indexes = {@Index(columnList = "creationTime"),
                @Index(columnList = "login", unique = true)}
)
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String login;

    @CreationTimestamp
    private Date creationTime;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @OrderBy("creationTime desc")
    private List<WordsList> wordsLists;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @OrderBy("creationTime desc")
    private List<TrainText> textsList;

    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Date getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(Date creationTime) {
        this.creationTime = creationTime;
    }

    public List<WordsList> getWordsLists() {
        return wordsLists;
    }

    public void setWordsLists(List<WordsList> wordsLists) {
        this.wordsLists = wordsLists;
    }

    public List<TrainText> getTextsList() {
        return textsList;
    }

    public void setTextsList(List<TrainText> textsList) {
        this.textsList = textsList;
    }
}
