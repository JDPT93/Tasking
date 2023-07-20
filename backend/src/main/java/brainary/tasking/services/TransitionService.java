package brainary.tasking.services;

import java.util.Objects;
import java.util.stream.Stream;

import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
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
    private TransitionRepository issueRepository;

    public TransitionSchema create(TransitionSchema issueSchema) {
        if (issueRepository.existsById(issueSchema.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("issue.conflict", null, LocaleContextHolder.getLocale()));
        }
        return modelMapper.map(issueRepository.save(modelMapper.map(issueSchema, TransitionEntity.class)), TransitionSchema.class);
    }

    public TransitionSchema deleteById(Integer issueId) {
        TransitionSchema issueSchema = findById(issueId);
        issueRepository.deleteById(issueId);
        return issueSchema;
    }

    public Page<TransitionSchema> findAll(Pageable pageable) {
        return issueRepository.findAll(pageable).map(issueEntity -> modelMapper.map(issueEntity, TransitionSchema.class));
    }

    public TransitionSchema findById(Integer issueId) {
        return modelMapper.map(issueRepository.findById(issueId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("issue.not-found", null, LocaleContextHolder.getLocale()))), TransitionSchema.class);
    }

    public ChangelogPayload<TransitionSchema> update(TransitionSchema newTransitionSchema) {
        TransitionSchema oldTransitionSchema = findById(newTransitionSchema.getId());
        BeanUtils.copyProperties(oldTransitionSchema, newTransitionSchema,
            Stream.of(BeanUtils.getPropertyDescriptors(TransitionSchema.class)).filter(descriptor -> {
                try {
                    return !Objects.isNull(descriptor.getReadMethod().invoke(newTransitionSchema));
                } catch (Exception exception) {
                    return true;
                }
            }).map(descriptor -> descriptor.getName()).toArray(String[]::new));
        issueRepository.save(modelMapper.map(newTransitionSchema, TransitionEntity.class));
        return ChangelogPayload.<TransitionSchema>builder()
            .before(oldTransitionSchema)
            .after(newTransitionSchema)
            .build();
    }

}
