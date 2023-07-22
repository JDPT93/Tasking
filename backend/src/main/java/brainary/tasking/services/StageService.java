package brainary.tasking.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entities.StageEntity;
import brainary.tasking.payloads.ChangelogPayload;
import brainary.tasking.repositories.StageRepository;
import brainary.tasking.schemas.StageSchema;

@Service
public class StageService {

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private StageRepository stageRepository;

    public StageSchema create(StageSchema stageSchema) {
        if (stageRepository.existsById(stageSchema.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("stage.conflict", null, LocaleContextHolder.getLocale()));
        }
        stageSchema.setActive(true);
        return modelMapper.map(stageRepository.save(modelMapper.map(stageSchema, StageEntity.class)), StageSchema.class);
    }

    public StageSchema deleteById(Integer stageId) {
        StageSchema stageSchema = findById(stageId);
        stageRepository.deleteById(stageId);
        return stageSchema;
    }

    public Page<StageSchema> findAll(Pageable pageable) {
        return stageRepository.findAll(pageable).map(stageEntity -> modelMapper.map(stageEntity, StageSchema.class));
    }

    public StageSchema findById(Integer stageId) {
        return modelMapper.map(stageRepository.findById(stageId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("stage.not-found", null, LocaleContextHolder.getLocale()))), StageSchema.class);
    }

    public ChangelogPayload<StageSchema> update(StageSchema newStageSchema) {
        StageSchema oldStageSchema = findById(newStageSchema.getId());
        newStageSchema.setActive(oldStageSchema.getActive());
        stageRepository.save(modelMapper.map(newStageSchema, StageEntity.class));
        return ChangelogPayload.<StageSchema>builder()
            .before(oldStageSchema)
            .after(newStageSchema)
            .build();
    }

}
