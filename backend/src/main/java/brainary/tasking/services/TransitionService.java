package brainary.tasking.services;

import java.util.Objects;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entities.TransitionEntity;
import brainary.tasking.payloads.ChangelogPayload;
import brainary.tasking.repositories.TransitionRepository;
import brainary.tasking.schemas.TransitionSchema;

@Service
public class TransitionService {
    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TransitionRepository transitionRepository;

    public TransitionSchema create(TransitionSchema transitionSchema) {
        if (transitionRepository.existsById(transitionSchema.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("transition.conflict", null, LocaleContextHolder.getLocale()));
        }
        if (Objects.isNull(transitionSchema.getActive())) {
            transitionSchema.setActive(true);
        }
        return modelMapper.map(transitionRepository.save(modelMapper.map(transitionSchema, TransitionEntity.class)), TransitionSchema.class);
    }

    public TransitionSchema deleteById(Integer transitionId) {
        TransitionSchema transitionSchema = findById(transitionId);
        transitionRepository.deleteById(transitionId);
        return transitionSchema;
    }

    public Page<TransitionSchema> findAll(Pageable pageable) {
        return transitionRepository.findAll(pageable).map(transitionEntity -> modelMapper.map(transitionEntity, TransitionSchema.class));
    }

    public TransitionSchema findById(Integer transitionId) {
        return modelMapper.map(transitionRepository.findById(transitionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("transition.not-found", null, LocaleContextHolder.getLocale()))), TransitionSchema.class);
    }

    public ChangelogPayload<TransitionSchema> update(TransitionSchema transitionSchema) {
        return ChangelogPayload.<TransitionSchema>builder()
            .before(findById(transitionSchema.getId()))
            .after(modelMapper.map(transitionRepository.save(modelMapper.map(transitionSchema, TransitionEntity.class)), TransitionSchema.class))
            .build();
    }

}
