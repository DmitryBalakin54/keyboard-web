package ru.site.proj.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import ru.site.proj.dto.CombinedTrainDataDTO;
import ru.site.proj.service.CombinedTrainDataService;


@RestController
@RequestMapping("/api")
public class CombinedTrainDataController {
    private final CombinedTrainDataService combinedTrainDataService;

    public CombinedTrainDataController(CombinedTrainDataService combinedTrainDataService) {
        this.combinedTrainDataService = combinedTrainDataService;
    }

    @GetMapping("/train/all")
    public Page<CombinedTrainDataDTO> getCombinedData(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return combinedTrainDataService.getCombinedTrainData(pageable);
    }
}
