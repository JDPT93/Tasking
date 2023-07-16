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

import brainary.tasking.entities.CollaborationEntity;
import brainary.tasking.payloads.ChangelogPayload;
import brainary.tasking.repositories.CollaborationRepository;
import brainary.tasking.schemas.CollaborationSchema;

@Service
public class CollaborationService {
    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private CollaborationRepository collaborationRepository;

    public CollaborationSchema create(CollaborationSchema collaborationSchema) {
        if (collaborationRepository.existsById(collaborationSchema.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("collaboration.conflict", null, LocaleContextHolder.getLocale()));
        }
        return modelMapper.map(collaborationRepository.save(modelMapper.map(collaborationSchema, CollaborationEntity.class)), CollaborationSchema.class);
    }

    public CollaborationSchema deleteById(Integer collaborationId) {
        CollaborationSchema collaborationSchema = findById(collaborationId);
        collaborationRepository.deleteById(collaborationId);
        return collaborationSchema;
    }

    public Page<CollaborationSchema> findAll(Pageable Pageable) {
        return collaborationRepository.findAll(Pageable).map(collaborationEntity -> modelMapper.map(collaborationEntity, CollaborationSchema.class));
    }

    public CollaborationSchema findById(Integer collaborationId) {
        return modelMapper.map(collaborationRepository.findById(collaborationId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("collaboration.not-found", null, LocaleContextHolder.getLocale()))), CollaborationSchema.class);
    }

    public ChangelogPayload<CollaborationSchema> update(CollaborationSchema newCollaborationSchema) {
        CollaborationSchema oldCollaborationSchema = findById(newCollaborationSchema.getId());
        BeanUtils.copyProperties(oldCollaborationSchema, newCollaborationSchema,
            Stream.of(BeanUtils.getPropertyDescriptors(CollaborationSchema.class)).filter(descriptor -> {
                try {
                    return !Objects.isNull(descriptor.getReadMethod().invoke(newCollaborationSchema));
                } catch (Exception exception) {
                    return true;
                }
            }).map(descriptor -> descriptor.getName()).toArray(String[]::new));
        collaborationRepository.save(modelMapper.map(newCollaborationSchema, CollaborationEntity.class));
        return ChangelogPayload.<CollaborationSchema>builder()
            .before(oldCollaborationSchema)
            .after(newCollaborationSchema)
            .build();
    }

}