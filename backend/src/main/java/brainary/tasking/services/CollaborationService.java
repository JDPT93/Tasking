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
        collaborationSchema.setActive(true);
        return modelMapper.map(collaborationRepository.save(modelMapper.map(collaborationSchema, CollaborationEntity.class)), CollaborationSchema.class);
    }

    public CollaborationSchema deleteById(Integer collaborationId) {
        CollaborationSchema collaborationSchema = retrieveById(collaborationId);
        collaborationRepository.deleteById(collaborationId);
        return collaborationSchema;
    }

    public Page<CollaborationSchema> retrieveAll(Pageable pageable) {
        return collaborationRepository.findAll(pageable).map(collaborationEntity -> modelMapper.map(collaborationEntity, CollaborationSchema.class));
    }

    public CollaborationSchema retrieveById(Integer collaborationId) {
        return modelMapper.map(collaborationRepository.findById(collaborationId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("collaboration.not-found", null, LocaleContextHolder.getLocale()))), CollaborationSchema.class);
    }

    public ChangelogPayload<CollaborationSchema> update(CollaborationSchema newCollaborationSchema) {
        CollaborationSchema oldCollaborationSchema = retrieveById(newCollaborationSchema.getId());
        newCollaborationSchema.setActive(oldCollaborationSchema.getActive());
        collaborationRepository.save(modelMapper.map(newCollaborationSchema, CollaborationEntity.class));
        return ChangelogPayload.<CollaborationSchema>builder()
            .before(oldCollaborationSchema)
            .after(newCollaborationSchema)
            .build();
    }

}
